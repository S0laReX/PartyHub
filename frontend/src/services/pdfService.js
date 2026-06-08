export const getTicketPdfUrl = (id) => {
  return `http://localhost:8000/api/pdf/ticket/${id}`;
};

export const getReportPdfUrl = () => {
  return "http://localhost:8000/api/pdf/report";
};