import Task from "../models/tasks.js";

//creating the task function
export const createTask = async (req, res) => {
  try {
    const { title, description, status = "incomplete" } = req.body;

    //accessing the author details from the authMiddleware
    const author = req.user._id;

    //creating an new task
    const newTask = new Task({
      title,
      description,
      author,
      status,
    });

    //saving the task to the database
    await newTask.save();

    /**
     * response contains success status, message and the data
     * data is nothing but the newly created task
     */
    return res.status(201).json({
      success: true,
      message: "task created successfully",
      data: newTask,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error" });
  }
};

//getting all the tasks
export const getTasks = async (req, res) => {
  try {
    //getting all the tasks from the database
    const tasks = await Task.find();

    /**
     * response contains success status, message and the data
     * data is nothing but list of all the tasks(basically array of tasks of user)
     */
    return res.status(200).json({
      success: true,
      message: "fetched the tasks successfully",
      data: tasks,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error" });
  }
};

//updating the tasks
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status = "incomplete" } = req.body;

    //finding the task by id
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "task not found" });
    }

    //updating the task
    task.title = title;
    task.description = description;
    task.status = status;
    task.updatedAt = Date.now();

    //saving the updated task
    await task.save();

    /**
     * response contains success status, message and the data
     * data is nothing but the updated task
     */
    return res.status(200).json({
      success: true,
      message: "task updated successfully",
      data: task,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    //finding the task by id and delete
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ message: "task not found" });
    }

    /**
     * response contains success status, message and the data
     * data is nothing but the deleted task
     */
    return res.status(200).json({
      success: true,
      message: "task deleted successfully",
      data: task,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error" });
  }
};
