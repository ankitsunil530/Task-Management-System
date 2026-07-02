const getBaseUrl = (req) => {
  return (process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`).replace(
    /\/$/,
    ""
  );
};

export default getBaseUrl;
