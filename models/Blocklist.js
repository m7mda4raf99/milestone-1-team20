const mongoose= require('mongoose')

const blocklist=new mongoose.Schema({
    name: {
        type: String
    }
}
)

module.exports = mongoose.model('Blocklist', blocklist)
