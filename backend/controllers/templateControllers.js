export const templateControllers = async (req, res) => {
    try {
      const users = { name: 'John Doe', age: 25 };
      res.status(200).json(users);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
  