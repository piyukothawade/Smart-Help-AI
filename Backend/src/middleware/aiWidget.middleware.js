import Ticket from "../models/Ticket.js";
import User from "../models/User.js";

const normalizeTenantId = (value) => {
  const rawValue = Array.isArray(value) ? value[0] : value;
  return typeof rawValue === "string" ? rawValue.trim() : "";
};

const findTenantUser = async (tenantId) => {
  const normalizedTenantId = normalizeTenantId(tenantId);
  if (!normalizedTenantId) return null;

  return User.findOne({ tenantId: normalizedTenantId }).select("_id tenantId");
};

export const validateWidgetTenantId = async (tenantId) => {
  return findTenantUser(tenantId);
};

export const validateWidgetTicket = async ({
  apiKey,
  tenantId,
  ticketId,
  visitorId,
}) => {
  const activeTenantId = normalizeTenantId(tenantId || apiKey);
  const tenantUser = await validateWidgetTenantId(activeTenantId);

  if (!tenantUser || !ticketId) return null;

  const query = {
    _id: ticketId,
    source: "widget",
    tenantId: activeTenantId,
  };

  if (visitorId) query.visitorId = visitorId;

  return Ticket.findOne(query);
};

export const widgetAuth = async (req, res, next) => {
  const tenantId = normalizeTenantId(req.headers["x-api-key"]);
  const tenantUser = await validateWidgetTenantId(tenantId);

  if (!tenantUser) {
    return res.status(401).json({
      success: false,
      message: "Invalid or missing tenant ID",
    });
  }

  req.widget = {
    tenantId,
    userId: tenantUser._id,
  };
  next();
};

export default widgetAuth;
