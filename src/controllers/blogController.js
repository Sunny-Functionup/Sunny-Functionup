const authorModel = require('../models/AuthorModel')
const BlogModel = require('../models/blogsModel')
const mongoose = require("mongoose")
// ======================================  Function Declared Here  ===============================================
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const BodyReqValid = function (requestBody) {
    return Object.keys(requestBody).length > 0
}
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}
// ===============================================================================================================
const CreateBlog = async function (req, res) {
    try {
        const requestBody = req.body;
        if (!BodyReqValid(requestBody)) {
            res.status(400).send({ status: false, message: 'invalid request please provide blog details' })
            return
        }
        // Extract params from request body
        const { title, body, authorId, tags, category, subcategory, isPublished } = requestBody;
        // Validation starts-----------------------------------------------------------------
        if (!isValid(title)) {
            res.status(400).send({ status: false, message: 'Blog Title needed' })
            return
        }
        if (!isValid(body)) {
            res.status(400).send({ status: false, message: 'blog body needed' })
            return
        }
        if (!isValid(authorId)) {
            res.status(400).send({ status: false, message: 'author id needed' })
            return
        }
        if (!isValidObjectId(authorId)) {
            res.status(400).send({ status: false, message: `${authorId} not a valid author id` })
            return
        }
        if (!isValid(category)) {
            res.status(400).send({ status: false, message: 'blog category needed' })
            return
        }
        const author = await authorModel.findById(authorId);
        if (!author) {
            res.status(400).send({ status: false, message: `author does not exit` })
            return
        }
        // Validation ends----------------------------------------------------------------------------
        const blogData = {
            title, body, authorId, category,
            isPublished: isPublished ? isPublished : false,
            publishedAt: isPublished ? new Date() : null
        }
        if (tags) {
            if (Array.isArray(tags)) {
                blogData['tags'] = [...tags]
            }
            if (typeof (tags) === 'string') {
                blogData['tags'] = [tags]
            }
        }
        if (subcategory) {
            if (Array.isArray(subcategory)) {
                blogData['subcategory'] = [...subcategory]
            }
            if (typeof (subcategory) === 'string') {
                blogData['subcategory'] = [subcategory]
            }
        }
        const newBlog = await BlogModel.create(blogData)
        res.status(201).send({ status: true, message: 'new blog sucessfully crated', data: newBlog })
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, message: error.message });
    }
}
// // ========================================================================================================
const GetBlogList = async function (req, res) {
    try {
        const filterQuery = { isDeleted: false, deletedAt: null, isPublished: true }
        const queryParams = req.query

        if (BodyReqValid(queryParams)) {
            const { authorId, category, tags, subcategory } = queryParams
            if (isValid(authorId) && isValidObjectId(authorId)) {
                filterQuery['authorId'] = authorId
            }
            if (isValid(category)) {
                filterQuery['category'] = category.trim()
            }
            if (isValid(tags)) {
                const tagsArr = tags.trim().split(',').map(tag => tag.trim());
                filterQuery['tags'] = { $all: tagsArr }
            }
            if (isValid(subcategory)) {
                const subcatArr = subcategory.trim().split(',').map(subcat => subcat.trim());
                filterQuery['subcategory'] = { $all: subcatArr }
            }
        }

        const blogs = await BlogModel.find(filterQuery)
        if (Array.isArray(blogs) && blogs.length === 0) {
            res.status(404).send({ status: false, message: 'no blogs found' })
            return
        }
        res.status(200).send({ status: true, message: 'all blogs list printed here', data: blogs })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
// // =========================================================================================================

const UpdateBlogs = async function (req, res) {
    try {
        const requestBody = req.body
        const params = req.params
        const blogId = params.blogId
        const authorIdFromToken = req.authorId
        // Validation starts----------------------------------------------------------------------------------
        if (!isValidObjectId(blogId)) {
            res.status(400).send({ status: false, message: `${blogId} not a valid blog id` })
            return
        }
        if (!isValidObjectId(authorIdFromToken)) {
            res.status(400).send({ status: false, message: `${authorIdFromToken} not a valid token id` })
            return
        }
        const blog = await BlogModel.findOne({ _id: blogId, isDeleted: false, deletedAt: null })
        if (!blog) {
            res.status(404).send({ status: false, message: `blog not found` })
            return
        }
        if (blog.authorId.toString() !== authorIdFromToken) {
            res.status(401).send({ status: false, message: `unauthorized input, owner data not matching` });
            return
        }
        if (!BodyReqValid(requestBody)) {
            res.status(200).send({ status: true, message: 'no paramaters passed. blog remains unaltered', data: blog })
            return
        }
        // Extractions of  params from here
        const { title, body, tags, category, subcategory, isPublished } = requestBody;

        //The $set operator replaces the givenvalue of a field with the specific value.
        const updatedBlogData = {}
        if (isValid(title)) {
            if (!Object.prototype.hasOwnProperty.call(updatedBlogData, '$set')) updatedBlogData['$set'] = {}
            updatedBlogData['$set']['title'] = title
        }
        if (isValid(body)) {
            if (!Object.prototype.hasOwnProperty.call(updatedBlogData, '$set')) updatedBlogData['$set'] = {}
            updatedBlogData['$set']['body'] = body
        }
        if (isValid(category)) {
            if (!Object.prototype.hasOwnProperty.call(updatedBlogData, '$set')) updatedBlogData['$set'] = {}
            updatedBlogData['$set']['category'] = category
        }
        if (isPublished !== undefined) {
            if (!Object.prototype.hasOwnProperty.call(updatedBlogData, '$set')) updatedBlogData['$set'] = {}
            updatedBlogData['$set']['isPublished'] = isPublished
            updatedBlogData['$set']['publishedAt'] = isPublished ? new Date() : false
        }
        //The $"addToSet" operator adds a value to an arrayhere--------
        //he $"each" modifier allows the $addToSet operator to add multiple values to the array field----
        if (tags) {
            if (!Object.prototype.hasOwnProperty.call(updatedBlogData, '$addToSet')) updatedBlogData['$addToSet'] = {}
            if (Array.isArray(tags)) {
                updatedBlogData['$addToSet']['tags'] = { $each: [...tags] }
            }
            if (typeof tags === "string") {
                updatedBlogData['$addToSet']['tags'] = tags
            }
        }
        if (subcategory) {
            if (!Object.prototype.hasOwnProperty.call(updatedBlogData, '$addToSet')) updatedBlogData['$addToSet'] = {}
            if (Array.isArray(subcategory)) {
                updatedBlogData['$addToSet']['subcategory'] = { $each: [...subcategory] }
            }
            if (typeof subcategory === "string") {
                updatedBlogData['$addToSet']['subcategory'] = subcategory
            }
        }
        const updatedBlog = await BlogModel.findOneAndUpdate({ _id: blogId }, updatedBlogData, { new: true })
        res.status(200).send({ status: true, message: 'blog updated successfully', data: updatedBlog });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
// ==============================================================================================================

const DeleteBlogById = async function (req, res) {
    try {
        const params = req.params
        const blogId = params.blogId
        const authorIdFromToken = req.authorId

        if (!isValidObjectId(blogId)) {
            res.status(400).send({ status: false, message: `${blogId} not a valid blog id` })
            return
        }
        if (!isValidObjectId(authorIdFromToken)) {
            res.status(400).send({ status: false, message: `${authorIdFromToken} not a valid token id` })
            return
        }
        const blog = await BlogModel.findOne({ _id: blogId, isDeleted: false, deletedAt: null })
        if (!blog) {
            res.status(404).send({ status: false, message: `blog not found` })
            return
        }
        if (blog.authorId.toString() !== authorIdFromToken) {
            res.status(401).send({ status: false, message: `unauthorized input, owner data not matching` });
            return
        }
        await BlogModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true, deletedAt: new Date() } })
        res.status(200).send({ status: true, message: `Blog deleted successfully` })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
// // ================================================================================================================

const deleteBlogByQuery = async function (req, res) {
    try {
        const filterQuery = { isDeleted: false, deletedAt: null }
        const queryParams = req.query
        const authorIdFromToken = req.authorId

        if (!isValidObjectId(authorIdFromToken)) {
            res.status(400).send({ status: false, message: `${authorIdFromToken} is not a valid token id` })
            return
        }
        if (!BodyReqValid(queryParams)) {
            res.status(400).send({ status: false, message: `No query found,stopping delete request` })
            return
        }
        const authorId = authorId.queryParams
        const category = category.queryParams
        const tags = tags.queryParams
        const subcategory = subcategory.queryParams
        const isPublished = isPublished.queryParams

        if (isValid(authorId) && isValidObjectId(authorId)) {
            filterQuery['authorId'] = authorId

        }
        if (isValid(category)) {
            filterQuery['category'] = category.trim()
        }

        if (isValid(isPublished)) {
            filterQuery['isPublished'] = isPublished
        }

        if (isValid(tags)) {
            const tagsArr = tags.trim().split(',').map(tag => tag.trim());
            filterQuery['tags'] = { $all: tagsArr }
        }

        if (isValid(subcategory)) {
            const subcatArr = subcategory.trim().split(',').map(subcat => subcat.trim());
            filterQuery['subcategory'] = { $all: subcatArr }
        }

        const blogs = await BlogModel.find(filterQuery);
        if (Array.isArray(blogs) && blogs.length === 0) {
            res.status(404).send({ status: false, message: 'none of matched blogs found' })
            return
        }
        const idsOfBlogsToBeDelete = blogs.map(blog => {
            if (blog.authorId.toString() === authorIdFromToken) return blog._id
        })

        if (idsOfBlogsToBeDelete.length === 0) {
            res.status(404).send({ status: false, message: 'no blogs found' })
            return
        }
        await BlogModel.updateMany({ _id: { $in: idsOfBlogsToBeDelete } }, { $set: { isDeleted: true, deletedAt: new Date() } })

        res.status(200).send({ status: true, message: 'blog deleted successfully now' });
    } catch (error) {

        res.status(500).send({ status: false, message: error.message });
    }
}
module.exports.CreateBlog = CreateBlog
module.exports.GetBlogList = GetBlogList
module.exports.UpdateBlogs = UpdateBlogs
module.exports.DeleteBlogById = DeleteBlogById
module.exports.deleteBlogByQuery = deleteBlogByQuery