const fs = require('fs')
const path = require('path')
const exiftool = require('node-exiftool')
const ep = new exiftool.ExiftoolProcess()

// const dirname = path.join(__dirname, 'test')
const dirname = '/Users/mac/Pictures/Garmin'

function writeExif(ep, filepath, metadata) {
  console.log(filepath, metadata)
  return ep.writeMetadata('destination.jpg', {
    all: '', // remove existing tags
    comment: 'Exiftool rules!',
    'Keywords+': [ 'keywordA', 'keywordB' ],
  }, ['overwrite_original'])
  // .then(console.log, console.error)
}

const toModify = new Map()

async function main() {
  const pid = await ep.open()
  console.log('process running on pid', pid)
  for (const filename of fs.readdirSync(dirname)) {
    const filepath = path.join(dirname, filename)
    const metadata = await ep.readMetadata(filepath, ['-File:all'])
    const GPSTrack = metadata.data[0].GPSTrack
    console.log(metadata.data[0].GPSTrack)
    console.log(metadata.data[0].GPSImgDirection)
    const status = await ep.writeMetadata(filepath, {
      GPSImgDirection: GPSTrack
    }, ['overwrite_original'])
    console.log(status)
  }
  ep.close()
}

main()
