let ar = []
document.querySelectorAll("#mount_0_0_BL > div > div:nth-child(1) > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div > div > div.x78zum5.xdt5ytf.x10cihs4.x1t2pt76.x1n2onr6.x1ja2u2z > div.x9f619.x2lah0s.x1nhvcw1.x1qjc9v5.xozqiw3.x1q0g3np.x78zum5.x1iyjqo2.x1t2pt76.x1n2onr6.x1ja2u2z.x1h6rjhl > div.x9f619.x1n2onr6.x1ja2u2z.xdt5ytf.x193iq5w.xeuugli.x1r8uery.x1iyjqo2.xs83m0k.x78zum5.x1t2pt76 > div > div > div > div > div > div").forEach(div=>{
let xpres = document.evaluate(".//span[contains(text(),'members')]", div, null, XPathResult.ANY_TYPE, null)
    ar.push({
        id: div.querySelector("a")?.getAttribute("href")?.replace(/(groups\/[^\/]+)\/.*$/, '$1/'),
        title: div.querySelector("div > div > div > div > div > div > div > div > div > div > div.x6s0dn4.xkh2ocl.x1q0q8m5.x1qhh985.xu3j5b3.xcfux6l.x26u7qi.xm0m39n.x13fuv20.x972fbf.x9f619.x78zum5.x1q0g3np.x1iyjqo2.xs83m0k.x1qughib.xat24cr.x11i5rnm.x1mh8g0r.xdj266r.x2lwn1j.xeuugli.x18d9i69.x4uap5.xkhd6sd.xexx8yu.x1n2onr6.x1ja2u2z > div.x1qjc9v5.x1q0q8m5.x1qhh985.xu3j5b3.xcfux6l.x26u7qi.xm0m39n.x13fuv20.x972fbf.x9f619.x78zum5.x1r8uery.xdt5ytf.x1iyjqo2.xs83m0k.x1qughib.xat24cr.x11i5rnm.x1mh8g0r.xdj266r.x2lwn1j.xeuugli.x4uap5.xkhd6sd.xz9dl7a.xsag5q8.x1n2onr6.x1ja2u2z > div > div > div:nth-child(1) > span > div > a")?.innerText,
        profile_pic: div.querySelector("div > div > div > div > div > div > div > div > div > div > div.x78zum5.xdt5ytf.xq8finb.x1xmf6yo.x1e56ztr.x1n2onr6.xqcrz7y > div > a > div > svg > g > image")?.getAttribute("xlink:href"),
        stats: xpres.iterateNext()?.innerText
    })
})