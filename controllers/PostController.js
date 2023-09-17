import req from "express/lib/request.js";
import PostSchema from "../models/Post.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostSchema.find().populate("user").exec();
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить данные",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    PostSchema.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      }
    ).then((doc, err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Failed to return the post",
        });
      }
      if (!doc) {
        return res.status(404).json({
          message: "Post not found",
        });
      }
      res.json(doc);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    PostSchema.findOneAndDelete({
      _id: postId,
    }).then((doc, err) => {
      if (err) {
        console.log(err);
        res.status(404).json({
          message: "Не удалось удалить статью",
        });
      }
      if (!doc) {
        console.log(err);
        res.status(404).json({
          message: "Не найдена статья",
        });
      }
      res.json({
        success: true,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error",
    });
  }
};

export const update = async(req, res) => {
  try {
    const postId = req.params.id;
    await PostSchema.updateOne({
      _id: postId
    },{
      title: req.body.title,
      text: req.body.text,
      imagerUrl: req.body.imagerUrl,
      tags: req.body.tags,
      user: req.userId,
    })
    
    res.json({
      success: true
    })
  } catch (error) {
    console.log(error);
        res.status(404).json({
          message: "Не удалось обновить статью"})
  }
}

export const create = async (req, res) => {
  try {
    const doc = new PostSchema({
      title: req.body.title,
      text: req.body.text,
      imagerUrl: req.body.imagerUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать статью",
    });
  }
};
