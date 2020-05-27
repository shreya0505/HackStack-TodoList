const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const Checklist = require("../models/Checklist");
const Schedule = require("../models/Schedule");
const StickyNotes = require("../models/StickyNotes");
const Tasks = require("../models/Tasks");
const Team = require("../models/Team");
const invite = require("../mailScript/invite");

// C R U D
//CREATE==================================================================================
router.post(
  "/",
  [
    check("teamName", "Name your team").notEmpty(),
    check("teamJoinCode", "Set team join code").notEmpty(),
    check("title", "Title your project").notEmpty(),
    check("purpose", "Purpose of project").notEmpty(),
    check("teamJoinCode", "Code min length 6 characters").isLength({
      min: 6,
    }),
  ],
  auth,
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    const {
      title,
      duedate,
      teamName,
      teamJoinCode,
      status,
      label,
      purpose,
    } = req.body;

    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res
          .status(400)
          .json({ error: [{ msg: "User does not exists" }] });
      }
      let teamMembers = [];
      teamMembers.push(req.user.id.toString());

      let newTeam = new Team({
        manager: req.user.id,
        managerName: user.username,
        title,
        duedate,
        teamName,
        teamMembers,
        teamJoinCode,
        status,
        label,
        purpose,
      });
      console.log(req.body);
      const team = await newTeam.save();
      user.team.unshift(team.id);
      await user.save();
      res.json(team.id);
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
      weekly,
      enddate,
      taskName,
      description,
      status,
      priority,
    } = req.body;

    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: [{ msg: "Page not found" }] });
    }
    try {
      const team = await Team.findById(req.params.id);
      if (!team) {
        return res
          .status(400)
          .json({ error: [{ msg: "Project does not exists" }] });
      }

      const newSchedule = new Schedule({
        owner: req.user.id,
        repeat,
        daily,
        weekly,
        enddate,
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
      team.task.unshift(task.id);
      const newActivityLog = {
        member: req.user.id,
        action: "post",
        target: "task",
        targetid: task.id,
      };
      team.activityLog.unshift(newActivityLog);
      await team.save();
      res.status(200).json({ success: [{ msg: "Task Added" }], id: task.id });
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
      const team = await Team.findById(req.params.id);
      if (!team) {
        return res
          .status(400)
          .json({ error: [{ msg: "Project does not exists" }] });
      }

      let found = 0;
      for (let i = 0; i < team.teamMembers.length; i++) {
        let str = team.teamMembers[i].toString();

        if (str === req.user.id) {
          found = 1;
          break;
        }
      }
      if (!found) {
        return res
          .status(400)
          .json({ error: [{ msg: "Not authorizied to view" }] });
      }

      const newNote = new StickyNotes({
        owner: req.user.id,
        title,
        message,
      });

      const note = await newNote.save();
      team.notes.unshift(note.id);

      const newActivityLog = {
        member: req.user.id,
        action: "post",
        target: "stickynotes",
        targetid: note.id,
      };
      team.activityLog.unshift(newActivityLog);
      await team.save();
      res.status(200).json({ success: [{ msg: "Note Added" }] });
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
    const { duedate, listName, priority } = req.body;
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: [{ msg: "Page not found" }] });
    }
    try {
      const team = await Team.findById(req.params.id);
      if (!team) {
        return res
          .status(400)
          .json({ error: [{ msg: "Project does not exists" }] });
      }

      let found = 0;
      for (let i = 0; i < team.teamMembers.length; i++) {
        let str = team.teamMembers[i].toString();

        if (str === req.user.id) {
          found = 1;
          break;
        }
      }
      if (!found) {
        return res
          .status(400)
          .json({ error: [{ msg: "Not authorizied to post" }] });
      }
      const newSchedule = new Schedule({
        owner: req.user.id,
        duedate,
      });

      const schedule = await newSchedule.save();

      const newChecklist = new Checklist({
        owner: req.user.id,
        listName,

        priority,
        schedule: schedule.id,
      });

      const list = await newChecklist.save();
      team.checklist.unshift(list.id);
      const newActivityLog = {
        member: req.user.id,
        action: "post",
        target: "checklist",
        targetid: list.id,
      };
      team.activityLog.unshift(newActivityLog);
      await team.save();
      return res
        .status(200)
        .json({ success: [{ msg: "List added Successfully" }], id: list.id });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: [{ msg: "Server Error" }] });
    }
  }
);

router.post(
  "/addlistitem/:id",
  [check("listitem", "Checklist item can't be blank").notEmpty()],
  auth,
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    const { listitem, status } = req.body;

    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: [{ msg: "Page not found" }] });
    }

    try {
      const checklist = await Checklist.findById(req.params.id);
      if (!checklist) {
        return res
          .status(400)
          .json({ error: [{ msg: "Checklist does not exists" }] });
      }

      if (req.user.id !== checklist.owner.toString()) {
        return res
          .status(400)
          .json({ error: [{ msg: "Not authorized to edit" }] });
      }
      const newItem = {
        item: listitem,
        status,
      };
      checklist.listItems.unshift(newItem);
      await checklist.save();
      return res.status(200).json({ success: [{ msg: "Item added" }] });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: [{ msg: "Server Error" }] });
    }
  }
);
router.post(
  "/addsubtask/:id",
  [check("sub", "Subtask can't be blank").notEmpty()],
  auth,
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    const { sub, status, due } = req.body;

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
          .json({ error: [{ msg: "Not authorized to post" }] });
      }
      const newItem = {
        sub,
        status,
        due,
      };
      task.subtasks.unshift(newItem);
      await task.save();
      return res.status(200).json({ success: [{ msg: "Subtask added" }] });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: [{ msg: "Server Error" }] });
    }
  }
);

router.put("/togglelist/:id/:cid", auth, async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  if (!req.params.cid.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  try {
    const list = await Checklist.findById(req.params.id);
    if (!list) {
      return res.status(400).json({ error: [{ msg: "List does not exists" }] });
    }

    // Handle Auth to Edit

    const item = list.listItems.find((item) => item.id === req.params.cid);
    item.status = !item.status;
    list.save();
    res.status(200).json({ success: [{ msg: "Successful pin action" }] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: [{ msg: "Server Error" }] });
  }
});

router.put("/toggletask/:id/:tid", auth, async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  if (!req.params.tid.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  try {
    const task = await Tasks.findById(req.params.id);
    if (!task) {
      return res.status(400).json({ error: [{ msg: "List does not exists" }] });
    }

    // Handle Auth to Edit

    const item = task.subtasks.find((item) => item.id === req.params.tid);
    item.status = !item.status;
    task.save();
    res.status(200).json({ success: [{ msg: "Completed" }] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: [{ msg: "Server Error" }] });
  }
});

router.post(
  "/join/:id",
  [
    check("teamid", "Enter Team Id recieved in Invitation Mail").notEmpty(),
    check(
      "teamJoinCode",
      " Enter Team Join Code recieved in Invitation Mail"
    ).notEmpty(),
  ],
  auth,
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(500).json({ error: error.array() });
    }
    const { teamid, teamJoinCode } = req.body;
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: [{ msg: "Page not found" }] });
    }
    try {
      const team = await Team.findById(req.params.id);
      if (!team) {
        return res
          .status(400)
          .json({ error: [{ msg: "Project does not exists" }] });
      }

      for (let i = 0; i < team.teamMembers.length; i++) {
        let str = team.teamMembers[i].toString();
        console.log(str, req.user.id, str === req.user.id);
        if (str === req.user.id) {
          return res
            .status(400)
            .json({ error: [{ msg: "Already Part of the team" }] });
        }
      }

      if (
        teamid.toString() === team.id.toString() &&
        teamJoinCode === team.teamJoinCode
      ) {
        team.teamMembers.unshift(req.user.id);
        console.log(team.teamMembers);
      } else {
        return res
          .status(400)
          .json({ error: [{ msg: "Invalid Credentials" }] });
      }
      const newActivityLog = {
        member: req.user.id,
        action: "joined",
        target: "welcome",
        targetid: req.user.id,
      };
      team.activityLog.unshift(newActivityLog);

      await team.save();
      const user = await User.findById(req.user.id);
      console.log(user);
      user.team.unshift(team.id);
      console.log(user.team);
      await user.save();
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: [{ msg: "Server Error" }] });
    }
  }
);

router.post(
  "/sendInvites/:id",
  [
    check("email", "Enter Email").exists(),
    check("email", "Enter valid email").isEmail(),
  ],
  auth,
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(500).json({ error: error.array() });
    }
    const { email } = req.body;
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: [{ msg: "Page not found" }] });
    }
    try {
      const team = await Team.findById(req.params.id);
      if (!team) {
        return res
          .status(400)
          .json({ error: [{ msg: "Project does not exists" }] });
      }

      if (req.user.id !== team.manager.toString()) {
        return res
          .status(400)
          .json({ error: [{ msg: "Only Team Manager can send Invites" }] });
      }

      await invite.mailinvite(
        email,
        team.managerName,
        team.teamName,
        team.purpose,
        team.id,
        team.teamJoinCode
      );

      res.status(200).json({ success: [{ msg: "Invite sent successfully" }] });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: [{ msg: "Server Error" }] });
    }
  }
);

router.post("/chat/:id", auth, async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  const { sender, text, date } = req.body;

  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(400).json({ error: [{ msg: "Team does not exists" }] });
    }

    let found = 0;
    for (let i = 0; i < team.teamMembers.length; i++) {
      let str = team.teamMembers[i].toString();

      if (str === req.user.id) {
        found = 1;
        break;
      }
    }
    if (!found) {
      return res
        .status(400)
        .json({ error: [{ msg: "Not authorizied to chat" }] });
    }

    const newChat = {
      sender: req.user.id,
      text: text,
    };
    team.chat.unshift(newChat);
    await team.save();
    res.status(200).json({ success: [{ msg: "New Chat" }] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: [{ msg: "Server Error" }] });
  }
});

//READ==================================================================================
router.get("/all", auth, async (req, res) => {
  try {
    const users = await User.find({}, "email username");

    res.json(users);
  } catch (error) {
    console.error(err.message);
    res.status(500).json({ error: [{ msg: "Server Error" }] });
  }
});

router.get("/project/:id", auth, async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  try {
    const team = await Team.findById(req.params.id)
      .populate("teamMembers", "username id")
      .populate("manager", "username id")
      .populate({
        path: "task",
        populate: {
          path: "schedule",
          model: "schedule",
        },
      })
      .populate("checklist")
      .populate("notes");
    if (!team) {
      return res
        .status(400)
        .json({ error: [{ msg: "Project does not exists" }] });
    }
    let found = 0;
    for (let i = 0; i < team.teamMembers.length; i++) {
      let str = team.teamMembers[i].id.toString();

      if (str === req.user.id) {
        found = 1;
        break;
      }
    }
    if (!found) {
      return res
        .status(400)
        .json({ error: [{ msg: "Not authorizied to view" }] });
    }
    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: [{ msg: "Server Error" }] });
  }
});

router.get("/activity/:id", auth, async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res
        .status(400)
        .json({ error: [{ msg: "Project does not exists" }] });
    }

    let found = 0;
    for (let i = 0; i < team.teamMembers.length; i++) {
      let str = team.teamMembers[i].toString();
      console.log(str, req.user.id);
      if (str === req.user.id) {
        found = 1;
        break;
      }
    }
    if (!found) {
      return res
        .status(400)
        .json({ error: [{ msg: "Not authorizied to view" }] });
    }
    res.json(team.activityLog);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: [{ msg: "Server Error" }] });
  }
});

router.get("/task/:id/:pid", auth, async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  if (!req.params.pid.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  try {
    const team = await Team.findById(req.params.pid);
    if (!team) {
      return res
        .status(400)
        .json({ error: [{ msg: "Project does not exists" }] });
    }

    const task = await Tasks.findById(req.params.id).populate("schedule");
    if (!task) {
      return res.status(400).json({ error: [{ msg: "Task does not exists" }] });
    }
    let found = 0;
    for (let i = 0; i < team.teamMembers.length; i++) {
      let str = team.teamMembers[i].id.toString();

      if (str === req.user.id) {
        found = 1;
        break;
      }
    }
    if (!found) {
      return res
        .status(400)
        .json({ error: [{ msg: "Not authorizied to view" }] });
    }
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: [{ msg: "Server Error" }] });
  }
});

router.get("/stickyNotes/:id/:pid", auth, async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  if (!req.params.pid.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  try {
    const team = await Team.findById(req.params.pid);
    if (!team) {
      return res
        .status(400)
        .json({ error: [{ msg: "Project does not exists" }] });
    }
    const note = await StickyNotes.findById(req.params.id);
    if (!note) {
      return res.status(400).json({ error: [{ msg: "Note does not exists" }] });
    }

    let found = 0;
    for (let i = 0; i < team.teamMembers.length; i++) {
      let str = team.teamMembers[i].toString();

      if (str === req.user.id) {
        found = 1;
        break;
      }
    }
    if (!found) {
      return res
        .status(400)
        .json({ error: [{ msg: "Not authorizied to view" }] });
    }
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: [{ msg: "Server Error" }] });
  }
});

router.get("/checklist/:id/:pid", auth, async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  if (!req.params.pid.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  try {
    const team = await Team.findById(req.params.pid);
    if (!team) {
      return res
        .status(400)
        .json({ error: [{ msg: "Project does not exists" }] });
    }
    const list = await Checklist.findById(req.params.id);
    if (!list) {
      return res.status(400).json({ error: [{ msg: "List does not exists" }] });
    }
    let found = 0;
    for (let i = 0; i < team.teamMembers.length; i++) {
      let str = team.teamMembers[i].id.toString();

      if (str === req.user.id) {
        found = 1;
        break;
      }
    }
    if (!found) {
      return res
        .status(400)
        .json({ error: [{ msg: "Not authorizied to view" }] });
    }
    res.json(list);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: [{ msg: "Server Error" }] });
  }
});

router.get("/chat/:id", auth, async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }

  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(400).json({ error: [{ msg: "Team does not exists" }] });
    }

    let found = 0;
    for (let i = 0; i < team.teamMembers.length; i++) {
      let str = team.teamMembers[i].toString();

      if (str === req.user.id) {
        found = 1;
        break;
      }
    }
    if (!found) {
      return res
        .status(400)
        .json({ error: [{ msg: "Not authorizied to chat" }] });
    }
    res.json(team.chat);
    f;
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
      const team = await Team.findById(req.params.id);
      if (!team) {
        return res
          .status(400)
          .json({ error: [{ msg: "Project does not exists" }] });
      }
      let found = 0;
      for (let i = 0; i < team.teamMembers.length; i++) {
        let str = team.teamMembers[i].id.toString();

        if (str === req.user.id) {
          found = 1;
          break;
        }
      }
      if (!found) {
        return res
          .status(400)
          .json({ error: [{ msg: "Not authorizied to view" }] });
      }
      const updated = await Team.findByIdAndUpdate(req.params.id, req.body);
      await updated.save();
      const newActivityLog = {
        member: req.user.id,
        action: "update",
        target: "project",
        targetid: req.params.id,
      };
      updated.activityLog.unshift(newActivityLog);
      await updated.save();
      res.status(200).json({ success: [{ msg: "Project updated" }] });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: [{ msg: "Server Error" }] });
    }
  }
);

router.put(
  "/updatetask/:id/:pid",
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
    if (!req.params.pid.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: [{ msg: "Page not found" }] });
    }

    try {
      const team = await Team.findById(req.params.pid);
      if (!team) {
        return res
          .status(400)
          .json({ error: [{ msg: "Project does not exists" }] });
      }
      const task = await Tasks.findById(req.params.id);
      if (!task) {
        return res
          .status(400)
          .json({ error: [{ msg: "Task does not exists" }] });
      }
      let found = 0;
      for (let i = 0; i < team.teamMembers.length; i++) {
        let str = team.teamMembers[i].id.toString();

        if (str === req.user.id) {
          found = 1;
          break;
        }
      }
      if (!found) {
        return res
          .status(400)
          .json({ error: [{ msg: "Not authorizied to view" }] });
      }

      let updated = await Tasks.findByIdAndUpdate(req.params.id, req.body);
      await updated.save();
      const newActivityLog = {
        member: req.user.id,
        action: "update",
        target: "task",
        targetid: req.params.id,
      };
      team.activityLog.unshift(newActivityLog);
      await team.save();
      res.status(200).json({ success: [{ msg: "Task updated" }] });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: [{ msg: "Server Error" }] });
    }
  }
);

router.put("/updateSchedule/:id/:pid", auth, async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  if (!req.params.pid.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  try {
    const team = await Team.findById(req.params.pid);
    if (!team) {
      return res
        .status(400)
        .json({ error: [{ msg: "Project does not exists" }] });
    }
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(400).json({ error: [{ msg: "Task does not exists" }] });
    }
    let found = 0;
    for (let i = 0; i < team.teamMembers.length; i++) {
      let str = team.teamMembers[i].id.toString();

      if (str === req.user.id) {
        found = 1;
        break;
      }
    }
    if (!found) {
      return res
        .status(400)
        .json({ error: [{ msg: "Not authorizied to view" }] });
    }
    let updated = await Schedule.findByIdAndUpdate(req.params.id, req.body);
    await updated.save();
    const newActivityLog = {
      member: req.user.id,
      action: "update",
      target: "schedule",
      targetid: req.params.id,
    };
    team.activityLog.unshift(newActivityLog);
    await team.save();
    res.status(200).json({ success: [{ msg: "Schedule updated" }] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: [{ msg: "Server Error" }] });
  }
});

router.put(
  "/updateStickyNotes/:id/:pid",
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
    if (!req.params.pid.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: [{ msg: "Page not found" }] });
    }
    try {
      const team = await Team.findById(req.params.pid);
      if (!team) {
        return res
          .status(400)
          .json({ error: [{ msg: "Project does not exists" }] });
      }
      const note = await StickyNotes.findById(req.params.id);
      if (!note) {
        return res
          .status(400)
          .json({ error: [{ msg: "Note does not exists" }] });
      }

      let found = 0;
      for (let i = 0; i < team.teamMembers.length; i++) {
        let str = team.teamMembers[i].id.toString();

        if (str === req.user.id) {
          found = 1;
          break;
        }
      }
      if (!found) {
        return res
          .status(400)
          .json({ error: [{ msg: "Not authorizied to view" }] });
      }

      const updated = await StickyNotes.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      await updated.save();
      const newActivityLog = {
        member: req.user.id,
        action: "update",
        target: "stickynotes",
        targetid: req.params.id,
      };
      team.activityLog.unshift(newActivityLog);
      await team.save();
      res.status(200).json({ success: [{ msg: "StickyNotes updated" }] });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: [{ msg: "Server Error" }] });
    }
  }
);

router.put(
  "/updateChecklist/:id/:pid",
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
    if (!req.params.pid.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: [{ msg: "Page not found" }] });
    }

    try {
      const team = await Team.findById(req.params.pid);
      if (!team) {
        return res
          .status(400)
          .json({ error: [{ msg: "Project does not exists" }] });
      }
      const list = await Checklist.findById(req.params.id);
      if (!list) {
        return res
          .status(400)
          .json({ error: [{ msg: "List does not exists" }] });
      }
      let found = 0;
      for (let i = 0; i < team.teamMembers.length; i++) {
        let str = team.teamMembers[i].id.toString();

        if (str === req.user.id) {
          found = 1;
          break;
        }
      }
      if (!found) {
        return res
          .status(400)
          .json({ error: [{ msg: "Not authorizied to view" }] });
      }
      const updated = await Checklist.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      await updated.save();
      const newActivityLog = {
        member: req.user.id,
        action: "update",
        target: "checklist",
        targetid: req.params.id,
      };
      team.activityLog.unshift(newActivityLog);
      await team.save();
      res.status(200).json({ success: [{ msg: "Checklist updated" }] });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: [{ msg: "Server Error" }] });
    }
  }
);

router.put("/completed/:id", auth, async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res
        .status(400)
        .json({ error: [{ msg: "Project does not exists" }] });
    }
    if (req.user.id !== team.manger.toString()) {
      return res
        .status(400)
        .json({ error: [{ msg: "Not authorized to edit" }] });
    }
    team.completed = !team.completed;
    await team.save();
    res.status(200).json({ success: [{ msg: "Successful action" }] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: [{ msg: "Server Error" }] });
  }
});

//DELETE==================================================================================

router.delete("/deleteProject/:id", auth, async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res
        .status(400)
        .json({ error: [{ msg: "Project does not exists" }] });
    }

    if (req.user.id !== team.manager.toString()) {
      return res
        .status(400)
        .json({ error: [{ msg: "Not authorized to delete" }] });
    }

    let task = team.task;
    for (let i = 0; i < task.length; i++) {
      const currentTask = await Tasks.findById(task[i]);
      await Schedule.findByIdAndDelete(currentTask.schedule);
      await Tasks.findByIdAndDelete(task[i]);
    }

    let teamMembers = team.teamMembers;
    for (let i = 0; i < teamMembers.length; i++) {
      const currentMember = await User.findById(teamMembers[i]);
      const team = currentMember.team.filter(
        (id) => id.toString() !== req.params.id
      );
      currentMember.team = team;
      currentMember.save();
    }

    let checklist = team.checklist;
    for (let i = 0; i < checklist.length; i++) {
      await Checklist.findByIdAndDelete(checklist[i]);
    }

    notes = team.notes;
    for (let i = 0; i < notes.length; i++) {
      await StickyNotes.findByIdAndDelete(notes[i]);
    }

    await Team.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: [{ msg: "Project deleted" }] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: [{ msg: "Server Error" }] });
  }
});

router.delete("/deletetask/:id/:pid", auth, async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  if (!req.params.pid.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  try {
    const team = await Team.findById(req.params.pid);
    if (!team) {
      return res
        .status(400)
        .json({ error: [{ msg: "Project does not exists" }] });
    }

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
    team.task = team.task.filter((id) => id.toString() !== req.params.id);
    const newActivityLog = {
      member: req.user.id,
      action: "delete",
      target: "task",
      targetid: req.params.id,
    };
    team.activityLog.unshift(newActivityLog);
    await team.save();
    res.status(200).json({ success: [{ msg: "Task deleted" }] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: [{ msg: "Server Error" }] });
  }
});

router.delete("/deleteStickyNotes/:id/:pid", auth, async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  if (!req.params.pid.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  try {
    const team = await Team.findById(req.params.pid);
    if (!team) {
      return res
        .status(400)
        .json({ error: [{ msg: "Project does not exists" }] });
    }
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
    team.notes = team.notes.filter((id) => id.toString() !== req.params.id);
    const newActivityLog = {
      member: req.user.id,
      action: "delete",
      target: "stickynotes",
      targetid: req.params.id,
    };
    team.activityLog.unshift(newActivityLog);
    await team.save();
    res.status(200).json({ success: [{ msg: "StickyNotes deleted" }] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: [{ msg: "Server Error" }] });
  }
});

router.delete("/deleteChecklist/:id/:pid", auth, async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  if (!req.params.pid.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: [{ msg: "Page not found" }] });
  }
  try {
    const team = await Team.findById(req.params.pid);
    if (!team) {
      return res
        .status(400)
        .json({ error: [{ msg: "Project does not exists" }] });
    }
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
    team.checklist = team.checklist.filter(
      (id) => id.toString() !== req.params.id
    );
    const newActivityLog = {
      member: req.user.id,
      action: "delete",
      target: "checklist",
      targetid: req.params.id,
    };
    team.activityLog.unshift(newActivityLog);
    await team.save();
    res.status(200).json({ success: [{ msg: "Checklist deleted" }] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: [{ msg: "Server Error" }] });
  }
});

module.exports = router;
