const express = require("express");
const router = express.Router();
const Checklist = require("../models/checklist");

router.get("/", async (req, res) => {
  try {
    const checklists = await Checklist.find({});
    res.status(200).render("checklists/index", { checklists: checklists });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .render("pages/error", { error: "Erro ao exibir as Listas" });
  }
});

router.get("/new", async (req, res) => {
  try {
    let checklist = new Checklist();
    res.status(200).render("checklists/new", { checklist: checklist });
  } catch (error) {
    res
      .status(500)
      .render("pages/error", { error: "Erro ao carregar o formulário" });
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    let checklist = await Checklist.findById(req.params.id);
    res.status(200).render("checklists/edit", { checklist: checklist });
  } catch (error) {
    res
      .status(500)
      .render("pages/error", { error: "Erro ao editar  Lista de Tarefas" });
  }
});

router.post("/", async (req, res) => {
  const { name } = req.body.checklist;
  let checklist = new Checklist({ name });

  try {
    await checklist.save();
    res.redirect("/checklists");
  } catch (error) {
    res
      .status(422)
      .render("checklists/new", { checklists: { ...checklist, error } });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const checklist = await Checklist.findById(req.params.id).populate("tasks");
    res.status(200).render("checklists/show", { checklist });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .render("pages/error", { error: "Erro ao exibir a Lista de Tarefas" });
  }
});

router.put("/:id", async (req, res) => {
  let { name } = req.body.checklist;

  try {
    let checklist = await Checklist.findById(req.params.id);

    if (!checklist) {
      return res.status(404).send("Checklist not found");
    }

    checklist.name = name;
    await checklist.save();

    res.redirect("/checklists");
  } catch (error) {
    let errors = error.errors;
    res
      .status(422)
      .render("checklists/edit", {
        checklist: { ...req.body.checklist, _id: req.params.id, errors },
      });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const checklist = await Checklist.findByIdAndDelete(req.params.id);
    res.redirect("/checklists");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .render("pages/error", { error: "Erro ao deletar Lista de Tarefas" });
  }
});

module.exports = router;
