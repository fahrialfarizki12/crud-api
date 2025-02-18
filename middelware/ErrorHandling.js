export const ErrorHandling = (err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Terjadi Kesalahan",
  });
};

export const notFound = (req, res, next) => {
  res.status(404).json({
    message: "Halaman yang Anda cari tidak ditemukan",
  });
};
