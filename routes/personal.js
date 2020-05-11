const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const Checklist = require("../models/Checklist");
const Schedule = require("../models/Schedule");
const StickyNotes = require("../models/StickyNotes");
const Tasks = require("../models/Tasks");
const Personal = require("../models/Personal");

// C R U D
//CREATE==================================================================================
router.post(
  "/",
  [check("title", "Title is required").notEmpty()],
  auth,
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    const {
      title,
      duedate,
      description,
      color,
      pinned,
      archived,
      status,
      label,
    } = req.body;

    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res
          .status(400)
          .json({ error: [{ msg: "User does not exists" }] });
      }

      let newPersonal = new Personal({
        owner: req.user.id,
        title,
        duedate,
        description,
        color,
        pinned,
        archived,
        status,
        label,
      });

      const personal = await newPersonal.save();
      user.personal.push(personal.id);
      await user.save();
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: [{ msg: "Server Error" }] });
    }
  }
);

router.post(
  "/task/:id",
  [check("taskName", "Task must be named").notEmpty()],
  auth,
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    const {
      repeat,
      daily,
      days,
      duedate,
      taskName,
      description,
      status,
      priority,
    } = req.body;

    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: [{ msg: "Page not found" }] });
    }
    try {
      const personal = await Personal.findById(req.params.id);
      if (!personal) {
        return res
          .status(400)
          .json({ error: [{ msg: "Project does not exists" }] });
      }

      const newSchedule = new Schedule({
        owner: req.user.id,
        repeat,
        daily,
        days,
        duedate,
      });

      const schedule = await newSchedule.save();
      const newTask = new Tasks({
        owner: req.user.id,
        taskName,
        description,
        status,
        priority,
        schedule: schedule.id,
      });
      const task = await newTask.save();
      personal.task.push(task.id);
      await personal.save();
      res.json(personal);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: [{ msg: "Server Error" }] });
    }
  }
);

router.post(
  "/stickyNotes/:id",
  [
    check("title", "Note must be named").notEmpty(),
    check("message", "Message is needed").notEmpty(),
  ],
  auth,
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    const { title, message } = req.body;
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: [{ msg: "Page not found" }] });
    }
    try {
      const personal = await Personal.findById(req.params.id);
      if (!personal) {
        return res
          .status(400)
          .json({ error: [{ msg: "Project does not exists" }] });
      }

      const newNote = new StickyNotes({
        owner: req.user.id,
        title,
        message,
      });

      const note = await newNote.save();
      personal.notes.push(note.id);
      await personal.save();
      res.json(personal);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: [{ msg: "Server Error" }] });
    }
  }
);

router.post(
  "/checklist/:id",
  [check("listName", "List must be named").notEmpty()],
  auth,
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    const {
      listName,
      description,
      status,
      priority,
      listItems,
      dueDate,
    } = req.body;
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: [{ msg: "Page not found" }] });
    }
    try {
      const personal = await Personal.findById(req.params.id);
      if (!personal) {
        return res
          .status(400)
          .json({ error: [{ msg: "Project does not exists" }] });
      }

      const newChecklist = new Checklist({
        owner: req.user.id,
        listName,
        description,
        status,
        priority,
        listItems,
        dueDate,
      });

      const list = await newChecklist.save();
      personal.checklist.push(list.id);
      await personal.save();
      res.json(personal);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: [{ msg: "Server Error" }] });
    }
  }
);
//READ==================================================================================

router.get("/project/:id", auth, async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  try {
    const personal = await Personal.findById(req.params.id);
    if (!personal) {
      return res
        .status(400)
        .json({ error: [{ msg: "Project does not exists" }] });
    }

    if (req.user.id !== personal.owner.toString()) {
      return res
        .status(400)
        .json({ error: [{ msg: "Not authorized to view" }] });
    }

    res.json(personal);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: [{ msg: "Server Error" }] });
  }
});

router.get("/task/:id", auth, async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  try {
    const task = await Tasks.findById(req.params.id);
    if (!task) {
      return res.status(400).json({ error: [{ msg: "Task does not exists" }] });
    }
    if (req.user.id !== task.owner.toString()) {
      return res
        .status(400)
        .json({ error: [{ msg: "Not authorized to edit" }] });
    }
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: [{ msg: "Server Error" }] });
  }
});

router.get("/stickyNotes/:id", auth, async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  try {
    const note = await StickyNotes.findById(req.params.id);
    if (!note) {
      return res.status(400).json({ error: [{ msg: "Note does not exists" }] });
    }

    if (req.user.id !== note.owner.toString()) {
      return res
        .status(400)
        .json({ error: [{ msg: "Not authorized to edit" }] });
    }
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: [{ msg: "Server Error" }] });
  }
});

router.get("/checklist/:id", auth, async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  try {
    const list = await Checklist.findById(req.params.id);
    if (!list) {
      return res.status(400).json({ error: [{ msg: "List does not exists" }] });
    }
    if (req.user.id !== list.owner.toString()) {
      return res
        .status(400)
        .json({ error: [{ msg: "Not authorized to edit" }] });
    }
    res.json(list);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: [{ msg: "Server Error" }] });
  }
});

//UPDATE==================================================================================

router.put(
  "/updateProject/:id",
  [check("title", "Title is required").notEmpty()],
  auth,
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: [{ msg: "Page not found" }] });
    }

    try {
      const personal = await Personal.findById(req.params.id);
      if (!personal) {
        return res
          .status(400)
          .json({ error: [{ msg: "Project does not exists" }] });
      }
      if (req.user.id !== personal.owner.toString()) {
        return res
          .status(400)
          .json({ error: [{ msg: "Not authorized to edit" }] });
      }
      const updated = await Personal.findByIdAndUpdate(req.params.id, req.body);
      await updated.save();
      res.status(200).json({ success: [{ msg: "Project updated" }] });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: [{ msg: "Server Error" }] });
    }
  }
);

router.put(
  "/updatetask/:id",
  [check("taskName", "Task must be named").notEmpty()],
  auth,
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: [{ msg: "Page not found" }] });
    }

    try {
      const task = await Tasks.findById(req.params.id);
      if (!task) {
        return res
          .status(400)
          .json({ error: [{ msg: "Task does not exists" }] });
      }
      if (req.user.id !== task.owner.toString()) {
        return res
          .status(400)
          .json({ error: [{ msg: "Not authorized to edit" }] });
      }

      let updated = await Tasks.findByIdAndUpdate(req.params.id, req.body);
      await updated.save();
      res.status(200).json({ success: [{ msg: "Task updated" }] });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: [{ msg: "Server Error" }] });
    }
  }
);

router.put("/updateSchedule/:id", auth, async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(400).json({ error: [{ msg: "Task does not exists" }] });
    }
    if (req.user.id !== schedule.owner.toString()) {
      return res
        .status(400)
        .json({ error: [{ msg: "Not authorized to edit" }] });
    }

    let updated = await Schedule.findByIdAndUpdate(req.params.id, req.body);
    await updated.save();
    res.status(200).json({ success: [{ msg: "Schedule updated" }] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: [{ msg: "Server Error" }] });
  }
});

router.put(
  "/updateStickyNotes/:id",
  [
    check("title", "Note must be named").notEmpty(),
    check("message", "Message is needed").notEmpty(),
  ],
  auth,
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: [{ msg: "Page not found" }] });
    }
    try {
      const note = await StickyNotes.findById(req.params.id);
      if (!note) {
        return res
          .status(400)
          .json({ error: [{ msg: "Note does not exists" }] });
      }

      if (req.user.id !== note.owner.toString()) {
        return res
          .status(400)
          .json({ error: [{ msg: "Not authorized to edit" }] });
      }

      const updated = await StickyNotes.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      await updated.save();
      res.status(200).json({ success: [{ msg: "StickyNotes updated" }] });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: [{ msg: "Server Error" }] });
    }
  }
);

router.put(
  "/updateChecklist/:id",
  [check("listName", "List must be named").notEmpty()],
  auth,
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: [{ msg: "Page not found" }] });
    }

    try {
      const list = await Checklist.findById(req.params.id);
      if (!list) {
        return res
          .status(400)
          .json({ error: [{ msg: "List does not exists" }] });
      }
      if (req.user.id !== list.owner.toString()) {
        return res
          .status(400)
          .json({ error: [{ msg: "Not authorized to edit" }] });
      }
      const updated = await Checklist.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      await updated.save();
      res.status(200).json({ success: [{ msg: "Checklist updated" }] });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: [{ msg: "Server Error" }] });
    }
  }
);

//DELETE==================================================================================
router.delete("/deleteProject/:id", auth, async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  try {
    const personal = await Personal.findById(req.params.id);
    if (!personal) {
      return res
        .status(400)
        .json({ error: [{ msg: "Project does not exists" }] });
    }

    if (req.user.id !== personal.owner.toString()) {
      return res
        .status(400)
        .json({ error: [{ msg: "Not authorized to delete" }] });
    }

    task = personal.task;
    for (let i = 0; i < task.length; i++) {
      const currentTask = await Tasks.findById(task[i]);
      await Schedule.findByIdAndDelete(currentTask.schedule);
      await Tasks.findByIdAndDelete(task[i]);
    }

    checklist = personal.checklist;
    for (let i = 0; i < checklist.length; i++) {
      await Checklist.findByIdAndDelete(checklist[i]);
    }

    notes = personal.notes;
    for (let i = 0; i < notes.length; i++) {
      await StickyNotes.findByIdAndDelete(notes[i]);
    }

    await Personal.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: [{ msg: "Project deleted" }] });

    let user = await User.findById(req.user.id);
    const personals = user.personal.filter(
      (id) => id.toString() !== req.params.id
    );
    user.personal = personals;
    user.save();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: [{ msg: "Server Error" }] });
  }
});

router.delete("/deletetask/:id", auth, async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  try {
    const task = await Tasks.findById(req.params.id);
    if (!task) {
      return res.status(400).json({ error: [{ msg: "Task does not exists" }] });
    }
    if (req.user.id !== task.owner.toString()) {
      return res
        .status(400)
        .json({ error: [{ msg: "Not authorized to edit" }] });
    }
    await Schedule.findByIdAndDelete(task.schedule);
    await Tasks.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: [{ msg: "Task deleted" }] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: [{ msg: "Server Error" }] });
  }
});

router.delete("/deleteStickyNotes/:id", auth, async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  try {
    const note = await StickyNotes.findById(req.params.id);
    if (!note) {
      return res.status(400).json({ error: [{ msg: "Note does not exists" }] });
    }

    if (req.user.id !== note.owner.toString()) {
      return res
        .status(400)
        .json({ error: [{ msg: "Not authorized to edit" }] });
    }

    await StickyNotes.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: [{ msg: "StickyNotes deleted" }] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: [{ msg: "Server Error" }] });
  }
});

router.delete("/deleteChecklist/:id", auth, async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  try {
    const list = await Checklist.findById(req.params.id);
    if (!list) {
      return res.status(400).json({ error: [{ msg: "List does not exists" }] });
    }
    if (req.user.id !== list.owner.toString()) {
      return res
        .status(400)
        .json({ error: [{ msg: "Not authorized to edit" }] });
    }
    await Checklist.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: [{ msg: "Checklist deleted" }] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: [{ msg: "Server Error" }] });
  }
});

module.exports = router;
