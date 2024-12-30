import Post from "../models/postModel.js";
import provider from "../models/provider.js";

export const crateNewPost = async (req, res) => {
  const { title, description, serviceType, status, location } = req.body;
  if (!title || !description || !serviceType || !status || !location) {
    return res.status(400).send({ error: "All fields are required" });
  }

  const userId = req.user.id;
  const providerData = await provider.findOne({ userID: userId });
  try {
    const newPost = new Post({
      userID: userId,
      providerID: providerData._id,
      title,
      description,
      serviceType,
      status,
      location,
      providerType: providerData.providerType,
    });

    const savedPost = await newPost.save();

    res.status(201).send({
      message: "Post successfully created",
      post: savedPost,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).send({ error: "Server error. Could not create post." });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userID", "id username email phone profileImg")
      .populate("providerID", "providerType");

    if (posts.length === 0) {
      return res
        .status(404)
        .send({ message: "No posts found matching the criteria" });
    }

    res.status(200).send({
      message: "Posts retrieved successfully",
      posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send({ error: "Server error. Could not fetch posts." });
  }
};

export const getFilteredPosts = async (req, res) => {
  try {
    const { serviceType, status, location, providerType, title } = req.query;
    const query = {};
    if (serviceType) {
      query.serviceType = { $in: serviceType.split(",") };
    }
    if (status) {
      query.status = { $in: status.split(",") };
    }
    if (location) {
      query.location = { $in: location.split(",") };
    }
    if (providerType) {
      query.providerType = { $in: providerType.split(",") };
    }
    if (title) {
      query.title = { $in: title.split(",") };
    }

    const posts = await Post.find(query)
      .populate("userID", "id username email phone profileImg")
      .populate("providerID", "providerType");

    res.status(200).json({
      message: "Filtered posts retrieved successfully",
      posts,
    });
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({
      error: "Server error. Could not retrieve posts.",
    });
  }
};

// export const getMyPosts = async (req, res) => {
//   try {
//     const id = req.user._id;
//     const postByUser = await Post.find({ createdBy: id });
//     if (!postByUser) {
//       return res
//         .status(404)
//         .send({ error: "posts not found pls add new posts" });
//     }
//     res.status(200).send(postByUser);
//   } catch (error) {
//     console.error("Error finding postById by ID:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// export const deletePostById = async (req, res) => {
//   const { id } = req.params;
//   const userId = req.user._id;
//   const postById = await Post.findById(id);
//   if (!postById) {
//     return res.status(404).send({ error: "post not found" });
//   }
//   if (userId === postById.createdBy.toString()) {
//     try {
//       const deletePost = await Post.findByIdAndDelete(id);
//       res.status(200).send({
//         message: "Book deleted successfully",
//         deletePost,
//       });
//     } catch (error) {
//       console.error("Error finding book by ID:", error);
//       res.status(500).json({ error: "Server error" });
//     }
//   } else
//     res.status(400).send({
//       status: "failed",
//       mes: "only user that created the post can delete him",
//     });
// };

// export const likePost = async (req, res) => {
//   try {
//     const postId = req.params.id;
//     const userId = req.user._id;

//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     if (post.likes.includes(userId)) {
//       post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
//     } else {
//       post.likes.push(userId);
//     }
//     await post.save();
//     res.status(200).json({
//       message: "Post liked/unliked successfully",
//       likes: post.likes,
//     });
//   } catch (error) {
//     console.error("Error toggling like:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };
