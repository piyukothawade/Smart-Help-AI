// features/admin/utils/analytics.js

export const getTicketStats = (tickets) => {
  let open = 0,
    closed = 0;

  tickets.forEach((t) =>
    t.status === "open" ? open++ : closed++
  );

  return { open, closed };
};