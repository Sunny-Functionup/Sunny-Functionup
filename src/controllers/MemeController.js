let axios = require("axios")
let memecreation = async function (req, res) {
    try {
        const memeId = req.query.template_id
        const {text0, text1} = req.query

        let options = {
            method: "post",
            url: `https://api.imgflip.com/caption_image?template_id=${memeId}&text0=${text0}&text1=${text1}&username=chewie12345&password=meme@123`
        }
        let result = await axios(options)
        res.status(200).send({ data: result.data })
    }
    catch (error){
        console.log(error)
        res.status(500).send({status:false,msg:"server error"})
    }
}

module.exports.memecreation=memecreation