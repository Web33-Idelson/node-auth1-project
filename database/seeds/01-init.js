exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users").insert([{ username: "joe", password: "pass" }]);
};