const dropZone = document.getElementById('dropZone')
const canvas = document.getElementById('canvas')
const prv = document.getElementById('preview')
const downloadButton = document.getElementById('downloadButton')
const ctx = canvas.getContext('2d')
const ctx_prev = prv.getContext('2d')
ctx.imageSmoothingEnabled = true
ctx.imageSmoothingQuality = 'high'
let img = new Image()

let setup = {
    bgblur: 10,

    bgoverlay_r: 32,
    bgoverlay_g: 23,
    bgoverlay_b: 23,
    bgoverlay_a: 1,

    shadow_r: 0,
    shadow_g: 0,
    shadow_b: 0,
    shadow_a: 0.5,
    shadow_shift: 5,
    shadow_blur: 10,

    inset: 30
}

function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.style.borderColor = 'green'
}

function handleDragLeave(event) {
    event.currentTarget.style.borderColor = '#ccc'
}

function handleDrop(event, img, callback) {
    event.preventDefault()
    event.currentTarget.style.borderColor = '#ccc'

    const file = event.dataTransfer.files[0]
    if (!file || !file.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onload = (e) => {
        img.src = e.target.result
        img.onload = callback
    }
    reader.readAsDataURL(file)
}

dropZone.addEventListener('dragover', handleDragOver)
dropZone.addEventListener('dragleave', handleDragLeave)
dropZone.addEventListener('drop', (event) => handleDrop(event, img, drawImage), false)


function drawImage() {
    w = canvas.width - setup.inset
    h = canvas.height - setup.inset
    if (img.width > img.height) {
        h = h * img.height / img.width
    } else {
        w = w * img.width / img.height
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.filter = `blur(${setup.bgblur}px)`
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    ctx.filter = 'none'

    ctx.fillStyle = `rgba(${setup.bgoverlay_r}, ${setup.bgoverlay_g}, ${setup.bgoverlay_b}, ${setup.bgoverlay_a})`
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.filter = `blur(${setup.shadow_blur}px)`
    ctx.fillStyle = `rgba(${setup.shadow_r}, ${setup.shadow_g}, ${setup.shadow_b}, ${setup.shadow_a})`

    ctx.fillRect((canvas.width - w) / 2 + setup.shadow_shift, (canvas.height - h) / 2 + setup.shadow_shift, w + setup.shadow_shift, h + setup.shadow_shift)
    ctx.filter = 'none'
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h)

    ctx_prev.drawImage(canvas,0,0,canvas.width/3.5, canvas.height/3.5)
}

downloadButton.addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/jpeg', 1.0)
    const link = document.createElement('a')
    link.href = dataURL
    link.download = 'mit_hole.jpg'
    link.click();
}, false)


function savesetup() {

    document.cookie = "isetup=" + JSON.stringify(setup) + ";expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/;SameSite=Lax"
}

window.addEventListener('beforeunload', (event) => savesetup())


function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(function (x) {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

window.addEventListener('load', () => {
    if (document.cookie.startsWith('isetup')) {
        setup = JSON.parse(document.cookie.split('=')[1])
        console.log(setup)
    }
    document.getElementById('bg.blur').value = setup.bgblur
    document.getElementById('bg.color').value = rgbToHex(setup.bgoverlay_r, setup.bgoverlay_g, setup.bgoverlay_b)
    document.getElementById('bg.alpha').value = setup.bgoverlay_a
    document.getElementById('shadow.blur').value = setup.shadow_blur
    document.getElementById('shadow.color').value = rgbToHex(setup.shadow_r, setup.shadow_g, setup.shadow_b)
    document.getElementById('shadow.alpha').value = setup.shadow_a
    document.getElementById('pic.inset').value = setup.inset
})
const bg_blur = document.getElementById('bg.blur')
const bg_color = document.getElementById('bg.color')
const bg_alpha = document.getElementById('bg.alpha')


bg_blur.addEventListener('change', (event) => {
    setup.bgblur = event.target.value
    drawImage()
}, false)

bg_color.addEventListener('change', (event) => {
    setup.bgoverlay_r = parseInt(event.target.value.substring(1, 3), 16)
    setup.bgoverlay_g = parseInt(event.target.value.substring(3, 5), 16)
    setup.bgoverlay_b = parseInt(event.target.value.substring(5, 7), 16)
    drawImage()
}, false)

bg_color.addEventListener('input', (event) => {
    setup.bgoverlay_r = parseInt(event.target.value.substring(1, 3), 16)
    setup.bgoverlay_g = parseInt(event.target.value.substring(3, 5), 16)
    setup.bgoverlay_b = parseInt(event.target.value.substring(5, 7), 16)
    drawImage()
}, false)

bg_alpha.addEventListener('change', (event) => {
    setup.bgoverlay_a = event.target.value
    drawImage()
}, false)

const shadowblur = document.getElementById('shadow.blur')
const shadowoffset = document.getElementById('shadow.offset')
const shadowcolor = document.getElementById('shadow.color')
const shadowalpha = document.getElementById('shadow.alpha')
const pic_inset = document.getElementById('pic.inset')

shadowblur.addEventListener('change', (event) => {
    setup.shadow_blur = event.target.value
    drawImage()
}, false)

shadowalpha.addEventListener('change', (event) => {
    setup.shadow_a = event.target.value
    drawImage()
}, false)

shadowcolor.addEventListener('input', (event) => {
    setup.shadow_r = parseInt(event.target.value.substring(1, 3), 16)
    setup.shadow_g = parseInt(event.target.value.substring(3, 5), 16)
    setup.shadow_b = parseInt(event.target.value.substring(5, 7), 16)
    drawImage()
}, false)

shadowcolor.addEventListener('change', (event) => {
    setup.shadow_r = parseInt(event.target.value.substring(1, 3), 16)
    setup.shadow_g = parseInt(event.target.value.substring(3, 5), 16)
    setup.shadow_b = parseInt(event.target.value.substring(5, 7), 16)
    drawImage()
}, false)

pic_inset.addEventListener('change', (event) => {
    setup.inset = event.target.value
    drawImage()
}, false)