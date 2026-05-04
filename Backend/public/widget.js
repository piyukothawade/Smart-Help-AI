(function () {
  "use strict";

  var initialized = false;

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function currentScriptBaseUrl() {
    var script =
      document.currentScript ||
      Array.prototype.slice.call(document.scripts).find(function (tag) {
        return tag.src && tag.src.indexOf("/widget.js") !== -1;
      });

    if (!script || !script.src) return "http://localhost:5000";

    try {
      return new URL(script.src).origin;
    } catch (_err) {
      return "http://localhost:5000";
    }
  }

  function loadSocketClient(baseUrl) {
    return new Promise(function (resolve, reject) {
      if (window.io) {
        resolve(window.io);
        return;
      }

      var script = document.createElement("script");
      script.src = baseUrl + "/socket.io/socket.io.js";
      script.async = true;
      script.onload = function () {
        window.io ? resolve(window.io) : reject(new Error("Socket.IO failed to load"));
      };
      script.onerror = function () {
        reject(new Error("Socket.IO failed to load"));
      };
      document.head.appendChild(script);
    });
  }

  function getVisitorId() {
    var key = "smartHelpVisitorId";
    var existing = localStorage.getItem(key);
    if (existing) return existing;

    var id =
      "visitor_" +
      Date.now().toString(36) +
      "_" +
      Math.random().toString(36).slice(2, 10);

    localStorage.setItem(key, id);
    return id;
  }

  function escapeHtml(value) {
    var div = document.createElement("div");
    div.textContent = value == null ? "" : String(value);
    return div.innerHTML;
  }

  function init() {
    if (initialized) return;

    var config = window.ChatWidgetConfig || window.SmartHelpWidget || {};
    var tenantId = config.tenantId || config.apiKey;
    if (!tenantId) {
      console.warn("Smart Help AI widget requires ChatWidgetConfig.tenantId");
      return;
    }

    initialized = true;

    var baseUrl = (config.apiUrl || currentScriptBaseUrl()).replace(/\/$/, "");
    var visitorId = config.visitorId || getVisitorId();
    var socket = null;
    var connected = false;
    var isOpen = false;
    var isTyping = false;

    var styles = `
      #smart-help-widget-button {
        position: fixed;
        right: 20px;
        bottom: 20px;
        width: 56px;
        height: 56px;
        border: 0;
        border-radius: 50%;
        background: #2563eb;
        color: #fff;
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.22);
        cursor: pointer;
        z-index: 2147483000;
        display: grid;
        place-items: center;
        font: 700 24px/1 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      #smart-help-widget-panel {
        position: fixed;
        right: 20px;
        bottom: 88px;
        width: 360px;
        height: 520px;
        max-width: calc(100vw - 32px);
        max-height: calc(100vh - 112px);
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        box-shadow: 0 22px 60px rgba(15, 23, 42, 0.24);
        z-index: 2147483001;
        display: none;
        overflow: hidden;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      #smart-help-widget-panel.open {
        display: flex;
        flex-direction: column;
      }
      .smart-help-header {
        min-height: 56px;
        padding: 0 14px 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #111827;
        color: #fff;
      }
      .smart-help-title {
        font-size: 15px;
        font-weight: 700;
      }
      .smart-help-status {
        font-size: 11px;
        color: #bfdbfe;
        margin-top: 2px;
      }
      .smart-help-close {
        width: 34px;
        height: 34px;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: #fff;
        font-size: 24px;
        cursor: pointer;
      }
      .smart-help-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        background: #f8fafc;
      }
      .smart-help-message {
        display: flex;
        margin: 0 0 12px;
      }
      .smart-help-message.user {
        justify-content: flex-end;
      }
      .smart-help-bubble {
        max-width: 82%;
        padding: 10px 12px;
        border-radius: 8px;
        font-size: 14px;
        line-height: 1.4;
        overflow-wrap: anywhere;
      }
      .smart-help-message.user .smart-help-bubble {
        background: #2563eb;
        color: #fff;
      }
      .smart-help-message.bot .smart-help-bubble {
        background: #fff;
        color: #111827;
        border: 1px solid #e5e7eb;
      }
      .smart-help-input-row {
        display: flex;
        gap: 10px;
        padding: 12px;
        border-top: 1px solid #e5e7eb;
        background: #fff;
      }
      #smart-help-input {
        flex: 1;
        min-height: 42px;
        max-height: 100px;
        resize: none;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        padding: 10px 12px;
        font: 14px/1.4 inherit;
        outline: none;
      }
      #smart-help-input:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
      }
      #smart-help-send {
        width: 42px;
        height: 42px;
        border: 0;
        border-radius: 50%;
        background: #2563eb;
        color: #fff;
        cursor: pointer;
        font-size: 18px;
      }
      #smart-help-send:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }
      @media (max-width: 480px) {
        #smart-help-widget-panel {
          right: 12px;
          bottom: 82px;
          width: calc(100vw - 24px);
          height: min(560px, calc(100vh - 104px));
        }
        #smart-help-widget-button {
          right: 16px;
          bottom: 16px;
        }
      }
    `;

    var style = document.createElement("style");
    style.textContent = styles;
    document.head.appendChild(style);

    var button = document.createElement("button");
    button.id = "smart-help-widget-button";
    button.type = "button";
    button.title = "Open support chat";
    button.setAttribute("aria-label", "Open support chat");
    button.textContent = "?";
    document.body.appendChild(button);

    var panel = document.createElement("section");
    panel.id = "smart-help-widget-panel";
    panel.setAttribute("aria-live", "polite");
    panel.innerHTML = `
      <div class="smart-help-header">
        <div>
          <div class="smart-help-title">${escapeHtml(config.title || "Support Chat")}</div>
          <div class="smart-help-status">Connecting...</div>
        </div>
        <button class="smart-help-close" type="button" aria-label="Close support chat">&times;</button>
      </div>
      <div class="smart-help-messages"></div>
      <form class="smart-help-input-row">
        <textarea id="smart-help-input" rows="1" placeholder="${escapeHtml(
          config.placeholder || "Type your message..."
        )}"></textarea>
        <button id="smart-help-send" type="submit" aria-label="Send message">&#8594;</button>
      </form>
    `;
    document.body.appendChild(panel);

    var closeButton = panel.querySelector(".smart-help-close");
    var status = panel.querySelector(".smart-help-status");
    var messages = panel.querySelector(".smart-help-messages");
    var form = panel.querySelector(".smart-help-input-row");
    var input = panel.querySelector("#smart-help-input");
    var sendButton = panel.querySelector("#smart-help-send");

    addMessage(config.welcomeMessage || "Hi! How can we help you today?", "bot");

    button.addEventListener("click", function () {
      setOpen(!isOpen);
    });

    closeButton.addEventListener("click", function () {
      setOpen(false);
    });

    input.addEventListener("input", function () {
      input.style.height = "auto";
      input.style.height = Math.min(input.scrollHeight, 100) + "px";
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      sendMessage();
    });

    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    });

    loadSocketClient(baseUrl)
      .then(function (io) {
        socket = io(baseUrl, {
          transports: ["websocket", "polling"],
          auth: { tenantId: tenantId, visitorId: visitorId },
        });

        socket.on("connect", function () {
          socket.emit(
            "widget:join",
            { tenantId: tenantId, visitorId: visitorId },
            function (res) {
              connected = !!(res && res.ok);
              status.textContent = connected ? "Online" : "Connection failed";
            }
          );
        });

        socket.on("disconnect", function () {
          connected = false;
          status.textContent = "Reconnecting...";
        });

        socket.on("connect_error", function () {
          connected = false;
          status.textContent = "Offline";
        });

        socket.on("widget:typing", function (payload) {
          setTyping(!!(payload && payload.typing));
        });

        socket.on("widget:message", function (message) {
          setTyping(false);
          addMessage(message.text || message.reply || "", "bot");
          sendButton.disabled = false;
          input.focus();
        });

        socket.on("widget:error", function (payload) {
          setTyping(false);
          addMessage((payload && payload.message) || "Server error, try again", "bot");
          sendButton.disabled = false;
        });
      })
      .catch(function () {
        status.textContent = "HTTP mode";
      });

    function setOpen(nextOpen) {
      isOpen = nextOpen;
      panel.classList.toggle("open", isOpen);
      button.setAttribute("aria-label", isOpen ? "Close support chat" : "Open support chat");
      if (isOpen) input.focus();
    }

    function sendMessage() {
      var text = input.value.trim();
      if (!text || isTyping) return;

      addMessage(text, "user");
      input.value = "";
      input.style.height = "auto";
      sendButton.disabled = true;

      if (socket && connected) {
        setTyping(true);
        socket.emit(
          "widget:message",
          { message: text, visitorId: visitorId },
          function (res) {
            if (res && res.ok) return;
            setTyping(false);
            sendButton.disabled = false;
            addMessage((res && res.message) || "Server error, try again", "bot");
          }
        );
        return;
      }

      sendViaHttp(text);
    }

    function sendViaHttp(text) {
      setTyping(true);

      fetch(baseUrl + "/api/tickets/widget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": tenantId,
        },
        body: JSON.stringify({ message: text, visitorId: visitorId }),
      })
        .then(function (response) {
          if (!response.ok) throw new Error("Server error");
          return response.json();
        })
        .then(function (data) {
          addMessage(data.reply || "No response received", "bot");
        })
        .catch(function () {
          addMessage("Server error, try again", "bot");
        })
        .finally(function () {
          setTyping(false);
          sendButton.disabled = false;
          input.focus();
        });
    }

    function setTyping(nextTyping) {
      isTyping = nextTyping;

      var existing = messages.querySelector("[data-typing='true']");
      if (!nextTyping && existing) existing.remove();
      if (nextTyping && !existing) {
        var typing = document.createElement("div");
        typing.className = "smart-help-message bot";
        typing.dataset.typing = "true";
        typing.innerHTML = '<div class="smart-help-bubble">Typing...</div>';
        messages.appendChild(typing);
        scrollToBottom();
      }
    }

    function addMessage(text, sender) {
      if (!text) return;

      var row = document.createElement("div");
      row.className = "smart-help-message " + sender;

      var bubble = document.createElement("div");
      bubble.className = "smart-help-bubble";
      bubble.textContent = text;

      row.appendChild(bubble);
      messages.appendChild(row);
      scrollToBottom();
    }

    function scrollToBottom() {
      messages.scrollTop = messages.scrollHeight;
    }
  }

  ready(init);
  setTimeout(init, 100);
})();
