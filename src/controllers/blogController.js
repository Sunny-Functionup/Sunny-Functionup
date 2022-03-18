const authorModel = require('../models/AuthorModel')
const BlogModel = require('../models/blogsModel')
const mongoose = require("mongoose")

// ======================================  Function Declared Here  ===============================================

const isValid = function(value) {
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isBodyRequestValid = function(requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValidObjectId = function(objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}
// ========================================================================================================

const CreateBlog = async function (req, res) {
    try {
        const requestBody = req.body;

        if(!isBodyRequestValid(requestBody)) {
            res.status(400).send({status: false, message: 'Invalid request please provide blog details'})
            return
        }

        // Extract params from request body
        const {title, body, authorId, tags, category, subcategory, isPublished} = requestBody;

        // Validation starts
        if(!isValid(title)) {
            res.status(400).send({status: false, message: 'Blog Title is required'})
            return
        }

        if(!isValid(body)) {
            res.status(400).send({status: false, message: 'Blog body is required'})
            return
        }

        if(!isValid(authorId)) {
            res.status(400).send({status: false, message: 'Author id is required'})
            return
        }

        if(!isValidObjectId(authorId)) {
            res.status(400).send({status: false, message: `${authorId} is not a valid author id`})
            return
        }

        if(!isValid(category)) {
            res.status(400).send({status: false, message: 'Blog category is required'})
            return
        }

        const author = await authorModel.findById(authorId);

        if(!author) {
            res.status(400).send({status: false, message: `Author does not exit`})
            return
        }
        // Validation ends

        const blogData = {
            title,
            body,
            authorId,
            category,
            isPublished: isPublished ? isPublished : false,
            publishedAt: isPublished ? new Date() : null

        }

        if(tags) {
            if(Array.isArray(tags)) {
                blogData['tags'] = [...tags]  
            }
            if(typeof(tags)==='string') {
                blogData['tags'] = [ tags ]
            }
        }

        if(subcategory) {
            if(Array.isArray(subcategory)) {
                blogData['subcategory'] = [...subcategory]
            }
            if(typeof(subcategory)==='string') {
                blogData['subcategory'] = [ subcategory ]
            }
        }

        const newBlog = await BlogModel.create(blogData)
        res.status(201).send({status: true, message: 'New blog sucessfully crated', data: newBlog})
    } catch (error) {
        console.log(error)
        res.status(500).send({status: false, message: error.message});
    }
}
// // ========================================================================================================

const GetBlogList = async function (req, res) {
    try {
        const filterQuery = {isDeleted: false, deletedAt: null, isPublished: true}
        const queryParams = req.query

        if(isBodyRequestValid(queryParams)) {
            const {authorId, category, tags, subcategory} = queryParams

            if(isValid(authorId) && isValidObjectId(authorId)) {
                filterQuery['authorId'] = authorId
            }

            if(isValid(category)) {
                filterQuery['category'] = category.trim()
            }

            if(isValid(tags)) {
                const tagsArr = tags.trim().split(',').map(tag => tag.trim());
                filterQuery['tags'] = {$all: tagsArr}
            }

            if(isValid(subcategory)) {
                const subcatArr = subcategory.trim().split(',').map(subcat => subcat.trim());
                filterQuery['subcategory'] = {$all: subcatArr}
            }
        }

        const blogs = await BlogModel.find(filterQuery)

        if(Array.isArray(blogs) && blogs.length===0) {
            res.status(404).send({status: false, message: 'No blogs found'})
            return
        }

        res.status(200).send({status: true, message: 'Blogs list', data: blogs})
    } catch (error) {
        res.status(500).send({status: false, message: error.message});
    }
}
// // =========================================================================================================

const UpdateBlogs = async function (req, res) {
    try {
        const requestBody = req.body
        const params = req.params
        const blogId = params.blogId
        const authorIdFromToken = req.authorId

        // Validation stats
        if(!isValidObjectId(blogId)) {
            res.status(400).send({status: false, message: `${blogId} is not a valid blog id`})
            return
        }

        if(!isValidObjectId(authorIdFromToken)) {
            res.status(400).send({status: false, message: `${authorIdFromToken} is not a valid token id`})
            return
        }

        const blog = await BlogModel.findOne({_id: blogId, isDeleted: false, deletedAt: null })

        if(!blog) {
            res.status(404).send({status: false, message: `Blog not found`})
            return
        }

        if(blog.authorId.toString() !== authorIdFromToken) {
            res.status(401).send({status: false, message: `Unauthorized access! Owner info doesn't match`});
            return
        }

        if(!isBodyRequestValid(requestBody)) {
            res.status(200).send({status: true, message: 'No paramateres passed. Blog unmodified', data: blog})
            return
        }

        // Extractions of  params
        const {title, body, tags, category, subcategory, isPublished} = requestBody;

       //The $set operator replaces the value of a field with the specified value.
        const updatedBlogData = {}

        if(isValid(title)) {
            if(!Object.prototype.hasOwnProperty.call(updatedBlogData, '$set')) updatedBlogData['$set'] = {}

            updatedBlogData['$set']['title'] = title
        }

        if(isValid(body)) {
            if(!Object.prototype.hasOwnProperty.call(updatedBlogData, '$set')) updatedBlogData['$set'] = {}

            updatedBlogData['$set']['body'] = body
        }

        if(isValid(category)) {
            if(!Object.prototype.hasOwnProperty.call(updatedBlogData, '$set')) updatedBlogData['$set'] = {}

            updatedBlogData['$set']['category'] = category
        }

        if(isPublished !== undefined) {
            if(!Object.prototype.hasOwnProperty.call(updatedBlogData, '$set')) updatedBlogData['$set'] = {}

            updatedBlogData['$set']['isPublished'] = isPublished
            updatedBlogData['$set']['publishedAt'] = isPublished ? new Date() : false
        }
        //The $addToSet operator adds a value to an array========================================
        //he $each modifier allows the $addToSet operator to add multiple values to the array field.=============
        if(tags) {
            if(!Object.prototype.hasOwnProperty.call(updatedBlogData, '$addToSet')) updatedBlogData['$addToSet'] = {}

            if(Array.isArray(tags)) {
                updatedBlogData['$addToSet']['tags'] = { $each: [...tags]}
            }
            if(typeof tags === "string") {
                updatedBlogData['$addToSet']['tags'] = tags
            }
        }

        if(subcategory) {
            if(!Object.prototype.hasOwnProperty.call(updatedBlogData, '$addToSet')) updatedBlogData['$addToSet'] = {}
            if(Array.isArray(subcategory)) {
                updatedBlogData['$addToSet']['subcategory'] = { $each: [...subcategory]}
            }
            if(typeof subcategory === "string") {
                updatedBlogData['$addToSet']['subcategory'] = subcategory
            }
        }

        const updatedBlog = await BlogModel.findOneAndUpdate({_id: blogId}, updatedBlogData, {new: true})

        res.status(200).send({status: true, message: 'Blog updated successfully', data: updatedBlog});
    } catch (error) {
        res.status(500).send({status: false, message: error.message});
    }
}
// // ==============================================================================================================

const DeleteBlogById = async function (req, res) {
    try {
        const params = req.params
        const blogId = params.blogId
        const authorIdFromToken = req.authorId

        if(!isValidObjectId(blogId)) {
            res.status(400).send({status: false, message: `${blogId} is not a valid blog id`})
            return
        }

        if(!isValidObjectId(authorIdFromToken)) {
            res.status(400).send({status: false, message: `${authorIdFromToken} is not a valid token id`})
            return
        }

        const blog = await BlogModel.findOne({_id: blogId, isDeleted: false, deletedAt: null })

        if(!blog) {
            res.status(404).send({status: false, message: `Blog not found`})
            return
        }

        if(blog.authorId.toString() !== authorIdFromToken) {
            res.status(401).send({status: false, message: `Unauthorized access! Owner info doesn't match`});
            return
        }

        await BlogModel.findOneAndUpdate({_id: blogId}, {$set: {isDeleted: true, deletedAt: new Date()}})
        res.status(200).send({status: true, message: `Blog deleted successfully`})
    } catch (error) {
        res.status(500).send({status: false, message: error.message});
    }
}
// // ================================================================================================================

const deleteBlogByQuery = async function (req, res) {
    try {
        const filterQuery = {isDeleted: false, deletedAt: null}
        const queryParams = req.query
        const authorIdFromToken = req.authorId

        if(!isValidObjectId(authorIdFromToken)) {
            res.status(400).send({status: false, message: `${authorIdFromToken} is not a valid token id`})
            return
        }

        if(!isBodyRequestValid(queryParams)) {
            res.status(400).send({status: false, message: `No query params received. Aborting delete operation`})
            return
        }

        const {authorId, category, tags, subcategory, isPublished} = queryParams

        if(isValid(authorId) && isValidObjectId(authorId)) {
            filterQuery['authorId'] = authorId
        }

        if(isValid(category)) {
            filterQuery['category'] = category.trim()
        }

        if(isValid(isPublished)) {
            filterQuery['isPublished'] = isPublished
        }

        if(isValid(tags)) {
            const tagsArr = tags.trim().split(',').map(tag => tag.trim());
            filterQuery['tags'] = {$all: tagsArr}
        }

        if(isValid(subcategory)) {
            const subcatArr = subcategory.trim().split(',').map(subcat => subcat.trim());
            filterQuery['subcategory'] = {$all: subcatArr}
        }

        const blogs = await BlogModel.find(filterQuery);

        if(Array.isArray(blogs) && blogs.length===0) {
            res.status(404).send({status: false, message: 'No matching blogs found'})
            return
        }

        const idsOfBlogsToBeDelete = blogs.map(blog => {
            if(blog.authorId.toString() === authorIdFromToken) return blog._id })


        if(idsOfBlogsToBeDelete.length === 0) {
            res.status(404).send({status: false, message: 'No blogs found'})
            return
        }

        await BlogModel.updateMany({_id: {$in: idsOfBlogsToBeDelete}}, {$set: {isDeleted: true, deletedAt: new Date()}})

        res.status(200).send({status: true, message: 'Blog deleted successfully'});

    } catch (error) {
        res.status(500).send({status: false, message: error.message});
    }
}

 module.exports.CreateBlog = CreateBlog
 module.exports.GetBlogList = GetBlogList
 module.exports.UpdateBlogs = UpdateBlogs
 module.exports.DeleteBlogById = DeleteBlogById
 module.exports.deleteBlogByQuery = deleteBlogByQuery



    


// const BlogModel = require("../models/blogsModel")
// const authorModel = require("../models/AuthorModel")

// //2.POST /blogs
// const CreateBlogs = async function (req, res) {
//     try {
//         let data = req.body
//         let authorId = data.authorId
//         let author = await authorModel.findById(authorId)
//         if (author) {
//             let createBlog = await BlogModel.create(data)
//             res.status(201).send({ status: true, data: createBlog })
//         } else {
            
//             res.status(400).send({ status: false, msg: `BAD REQUEST` })
//         }
//     } catch (error) {
//         res.status(500).send({ status: false, msg: error.message })
//     }
// }

// //3.GET /blogs
// const getBlogsData = async function (req, res) {
//     try {
        
//         let authorId= req.query.authorId
//         let category=req.query.category
//         let tags= req.query.tags
//         let subcategory=req.query.subcategory
//         let allBlogs = await BlogModel.find({isdeleted : false,isPublished:true, $or:[{category:category}, {authorId:authorId},{tags: {$all:[tags]}},{subcategory: {$all:[subcategory]}}]})

//         console.log(allBlogs)
//         if (allBlogs.length > 0) res.status(200).send({ msg: allBlogs, status: true })
//         else res.status(404).send({ msg: "No blog found", status: false })
//     } catch (err) {
//         console.log(err)
//         res.status(500).send({ msg: err.message })
//     }
// }


// //4
//  const updateBlogs = async function(req, res) {

//      try {
//          console.log("message")
//          let Id = req.params.blogId
//         let ifExist = await BlogModel.findOne({_id:Id,isDeleted:false})
//         console.log(ifExist)
//         if (!ifExist) {
//             return res.status(404).send({ status: false, msg: "Not Found" })
//         }
//          if (ifExist.isDeleted == false) {

//              let data = req.body
//              data.publishedAt = Date.now()
//              data.isPublished = true
//              //console.log(data)
//              let updatedBlog = await BlogModel.findOneAndUpdate({ _id: Id },{isPublished : true, publishedAt : new Date()}
//              , { new: true })

//              //console.log(updatedBlog)
//              return res.send(updatedBlog)
//         }
//      } catch (error) {
//          res.status(500).send({ status: false, msg: error.message })
//      }
//  }

// const deleteBlogs = async function (req, res) {
//     try {
//         let blogId = req.params.blogId;

//         if (!blogId) return res.status(400).send({ error: "blogId should be present in params" });
//         let blog = await BlogModel.findById(blogId);

//         if (!blog) {
//             return res.status(404).send("No such blog exists");
//         }
//         let deletedBlog = await BlogModel.findOneAndUpdate({ _id: blogId }, { isDeleted: true }, { new: true });
//         res.send({ status: "Deleted", data: deletedBlog });

//     }
//     catch (err) {
//         console.log(err)
//         res.status(500).send({ msg: err.message })
//     }
// }


// const deleteBlogByQuery = async function (req, res) {
//     try{
//         const data = req.query
//         if(Object.keys(data) == 0) {
//             return res.status(400).send({ status:false,msg:"No input provided"})
//         }
//             const deletByQuery =await BlogModel.updateMany(data, {isDeleted:true, deletedAt: new Date()}, {new:true})
//             if (!deletByQuery) return res.status(404).send({ status: false, msg: "No such blog found"})
//             res.status(200).send({ status: true, msg:deletByQuery})
        
//     }
//     catch (error) {
//           res.status(500).send({ status: false, msg: error.message })
//        }
// }

// module.exports.CreateBlogs = CreateBlogs
// module.exports.getBlogsData = getBlogsData
// module.exports.updateBlogs = updateBlogs
// module.exports.deleteBlogs = deleteBlogs
// module.exports.deleteBlogByQuery=deleteBlogByQuery