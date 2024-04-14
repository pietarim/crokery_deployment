interface User {
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

export const users: User[] = [
  {
    username: "test",
    email: "user@gmail.com",
    password: "password",
    isAdmin: false,
  },
  {
    username: "Carl",
    email: "carl@gmail.com",
    password: "secret123",
    isAdmin: false,
  },
  {
    username: "Alice",
    email: "alice@example.com",
    password: "password",
    isAdmin: true,
  },
  {
    username: "Bob",
    email: "bob@example.com",
    password: "secret123",
    isAdmin: false,
  },
  {
    username: "Diana",
    email: "diana@example.com",
    password: "password",
    isAdmin: false,
  },
  {
    username: "Ethan",
    email: "ethan@example.com",
    password: "secret123",
    isAdmin: true,
  },
  {
    username: "Fiona",
    email: "fiona@example.com",
    password: "password",
    isAdmin: false,
  },
  {
    username: "George",
    email: "george@example.com",
    password: "secret123",
    isAdmin: false,
  },
  {
    username: "Hannah",
    email: "hannah@example.com",
    password: "password",
    isAdmin: true,
  },
  {
    username: "Ian",
    email: "ian@example.com",
    password: "secret123",
    isAdmin: false,
  }
];