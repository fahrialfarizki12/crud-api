import { PrismaClient } from "@prisma/client";
import { ObjectId } from "mongodb";
const prisma = new PrismaClient();

export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;
    const offset = (page - 1) * limit; //sudah int

    const users = await prisma.user.findMany({
      where: {
        OR: [{ name: { contains: search } }, { email: { contains: search } }],
      },

      skip: offset, //0 mulai dari 0
      take: parseInt(limit),
    });

    const totalUsers = await prisma.user.count({
      where: {
        OR: [{ name: { contains: search } }, { email: { contains: search } }],
      },
    });

    res.status(200).json({
      users,
      totalUsers,
      totalPage: Math.ceil(totalUsers / limit),
    });
  } catch (error) {
    next(error);
  }
};


export const getUsersById = async (req, res, next) => {
  try {
    const userID = req.params.id; // konversi ke objectId
    // Validasi apakah ID valid sebagai ObjectId
    if (!ObjectId.isValid(userID)) {
      return next({ statusCode: 404, message: "Akun Tidak Ditemukan" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userID,
      },
    });

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
export const deleteUsers = async (req, res, next) => {
  try {
    const userID = req.params.id; // konversi ke objectId
    // Validasi apakah ID valid sebagai ObjectId
    if (!ObjectId.isValid(userID)) {
      return next({ statusCode: 404, message: "Akun Tidak Ditemukan" });
    }

    const user = await prisma.user.delete({
      where: {
        id: userID,
      },
    });

    res.status(200).json({ message: "Berhasil Hapus Data" });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (userExists) {
      return next({ statusCode: 401, message: "Email Sudah Ada" });
    }
    if (!name || !email || !password) {
      return next({ statusCode: 400, message: "Field Harus Disi Semua" });
    }
    if (password.length < 5) {
      return next({
        statusCode: 400,
        message: "Password Harus Minimal 5 Karakter",
      });
    }
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUsers = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const userID = req.params.id; // konversi ke objectId
    // Validasi apakah ID valid sebagai ObjectId
    if (!ObjectId.isValid(userID)) {
      return next({ statusCode: 404, message: "Akun Tidak Ditemukan" });
    }
    const users = await prisma.user.findFirst({
      where: {
        id: userID,
      },
    });

    if (
      users.name === name &&
      users.email === email &&
      users.password === password
    ) {
      return next({ statusCode: 400, message: "Data Tidak Di Update" });
    }

    if (password.length < 5) {
      return next({
        statusCode: 400,
        message: "Password Harus Minimal 5 Karakter",
      });
    }
    const user = await prisma.user.update({
      where: {
        id: userID,
      },
      data: {
        name,
        email,
        password,
      },
    });
    res.status(201).json({ message: "Berhasil updated" });
  } catch (error) {
    next(error);
  }
};
