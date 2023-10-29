const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedUsers() {
  const users = [
    {
      email: "user3@example.com",
      username: "user3",
      image:
        "https://i.pinimg.com/474x/3c/08/4c/3c084c62320470a8719600a02887cfff.jpg",
      bio: "User 3 bio",
      emailVerified: null,
      password_hash: null,
      dateJoined: new Date(),
      dateUpdated: new Date(),
      lastLogin: null,
      lastActive: null,
      isBanned: false,
      isDeleted: false,
      isSuspended: false,
      settings: {
        create: {
          email: true,
          push: true,
          isPrivate: false,
          isMinus: false,
          followerNotifications: true,
          replyNotifications: true,
          heartNotifications: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
    {
      email: "user4@example.com",
      username: "user4",
      image:
        "https://i.pinimg.com/474x/11/19/f9/1119f96357199a037aee85560c3ffb9d.jpg",
      bio: "User 4 bio",
      emailVerified: null,
      password_hash: null,
      dateJoined: new Date(),
      dateUpdated: new Date(),
      lastLogin: null,
      lastActive: null,
      isBanned: false,
      isDeleted: false,
      isSuspended: false,
      settings: {
        create: {
          email: true,
          push: true,
          isPrivate: false,
          isMinus: false,
          followerNotifications: true,
          replyNotifications: true,
          heartNotifications: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
    {
      email: "user5@example.com",
      username: "user5",
      image:
        "https://i.pinimg.com/474x/8a/83/a2/8a83a23b494b80404fa8c26455a99126.jpg",
      bio: "User 5 bio",
      emailVerified: null,
      password_hash: null,
      dateJoined: new Date(),
      dateUpdated: new Date(),
      lastLogin: null,
      lastActive: null,
      isBanned: false,
      isDeleted: false,
      isSuspended: false,
      settings: {
        create: {
          email: true,
          push: true,
          isPrivate: false,
          isMinus: false,
          followerNotifications: true,
          replyNotifications: true,
          heartNotifications: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
    {
      email: "user6@example.com",
      username: "user6",
      image:
        "https://i.pinimg.com/474x/fb/0f/88/fb0f8838de2b43e6c98225ee8db83051.jpg",
      bio: "User 6 bio",
      emailVerified: null,
      password_hash: null,
      dateJoined: new Date(),
      dateUpdated: new Date(),
      lastLogin: null,
      lastActive: null,
      isBanned: false,
      isDeleted: false,
      isSuspended: false,
      settings: {
        create: {
          email: true,
          push: true,
          isPrivate: false,
          isMinus: false,
          followerNotifications: true,
          replyNotifications: true,
          heartNotifications: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
    {
      email: "user7@example.com",
      username: "user7",
      image:
        "https://i.pinimg.com/474x/3a/b7/3e/3ab73ed328ddd75961cbc2d4de401a11.jpg",
      bio: "User 7 bio",
      emailVerified: null,
      password_hash: null,
      dateJoined: new Date(),
      dateUpdated: new Date(),
      lastLogin: null,
      lastActive: null,
      isBanned: false,
      isDeleted: false,
      isSuspended: false,
      settings: {
        create: {
          email: true,
          push: true,
          isPrivate: false,
          isMinus: false,
          followerNotifications: true,
          replyNotifications: true,
          heartNotifications: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
  ];

  for (const user of users) {
    try {
      await prisma.user.create({ data: user });
      console.log("User created:", user.email);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error creating user:", user.email, error.message);
      } else {
        console.error("Error creating user:", user.email, error);
      }
    }
  }
  await prisma.$disconnect();
}

// Execute the seedUsers function
seedUsers().catch(console.error);
