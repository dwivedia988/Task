import TaskSchemaModel from "../model/task.model.js";

export var save = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || title.trim() === "")
      return res.status(400).json({ message: "Title required" });

    const task = new TaskSchemaModel({
      title: title.trim(),
      user: req.user._id,
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export var fetch = async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await TaskSchemaModel.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    const grouped = {
      Pending: [],
      Processing: [],
      Completed: [],
    };
    tasks.forEach((t) => grouped[t.status].push(t));
    res.json(grouped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export var update = async (req, res) => {
  try {
    const { title, status } = req.body;
    const task = await TaskSchemaModel.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (!task.user.equals(req.user._id))
      return res.status(403).json({ message: "Forbidden" });

    if (title !== undefined) task.title = title;
    if (
      status !== undefined &&
      ["Pending", "Processing", "Completed"].includes(status)
    )
      task.status = status;

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export var deletetask = async (req, res) => {
  try {
    const task = await TaskSchemaModel.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (!task.user.equals(req.user._id))
      return res.status(403).json({ message: "Forbidden" });

    await task.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
