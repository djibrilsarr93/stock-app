import bcrypt from "bcryptjs";

// Liste des utilisateurs/admins avec mots de passe hachés
export const utilisateurs = [
  { username: "admin", password: bcrypt.hashSync("1234", 10) }, // mot de passe admin
  { username: "djibril", password: bcrypt.hashSync("abcd", 10) } // autre utilisateur
];
