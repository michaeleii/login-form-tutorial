const users = [
	{
		id: 1,
		username: "John",
		password: "password",
	},
	{
		id: 2,
		username: "Jane",
		password: "password",
	},
];

const getUserByUsername = (username) => {
	return users.find((user) => user.username === username);
};

const getUserById = (id) => {
	return users.find((user) => user.id === id);
};

module.exports = { getUserByUsername, getUserById };
