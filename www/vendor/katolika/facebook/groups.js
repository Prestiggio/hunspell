const https = require('https'); // or 'https' for https:// URLs
const fs = require('fs');

const chrome = ()=>{
    data = {}
    data.url = document.location.href
    data.title = document.querySelectorAll("h1 > span")[1].textContent
    data.members = []
    document.querySelectorAll("#mount_0_0_7O > div > div:nth-child(1) > div > div.rq0escxv.l9j0dhe7.du4w35lb > div > div > div.j83agx80.cbu4d94t.d6urw2fd.dp1hu0rb.l9j0dhe7.du4w35lb > div.l9j0dhe7.dp1hu0rb.cbu4d94t.j83agx80 > div.j83agx80.cbu4d94t.buofh1pr > div > div > div > div > div > div > div > div > div > div > div:nth-child(2) > div > div > div:nth-child(2) > div.b20td4e0.muag1w35 > div").forEach(it => {
        const d = {
            picture: it.querySelector('image').getAttribute('xlink:href')
        }
        it.querySelectorAll('span > a[role=link]').forEach(a => a.textContent ? d.name = a.textContent : null)
        data.members.push(d)
    })
}

const groups = [
    {
        "url": "https://web.facebook.com/groups/840565973376181/members",
        "title": "Fampielezana ny finoana Katolika",
        "members": [
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/c0.4.120.120a/p120x120/249550603_400648305106576_6700807122276994112_n.jpg?_nc_cat=100&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeE2FinOSCB0hYujK19yGbrpanHeY80-K7hqcd5jzT4ruImz7qPByNneH4A8yRKUC9M&_nc_ohc=KuB5hxAKkrsAX86NURp&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT-5VSHLcb7j-9lYjtt27yEhJ4TrM42YIu5sRA5yrPDBhQ&oe=61BD7FB5",
                "name": "Jean DE LA Croix"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t1.6435-1/c0.4.120.120a/p120x120/51651964_349844405614185_3732652933313986560_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeGX5Ln0KV7tvox2oTlwx5A_xsNokD1rjrXGw2iQPWuOtWJV4Fp5PqBSyVzGVSpSuoU&_nc_ohc=SrX6C_LvciMAX_0CSgD&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT-sI_Nar4oCvhkC4uQyjCjjXHaAj21BhvrDMo8X2lh_rw&oe=61DE51EB",
                "name": "Jean de la Croix"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t1.6435-1/c20.0.120.120a/p120x120/210372234_521997602488695_7852868173660635330_n.jpg?_nc_cat=100&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeFG5qFL6kPUwjCupzYR_k-yG21e_V9S490bbV79X1Lj3YMyfq4E57tKhN9bR7-a11A&_nc_ohc=cHGQs4CNTMQAX9PdfCh&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT8yTxArqFIam8LPuOJe7_tfiJwvCgXsPs8e9nqspOKhJw&oe=61DDAEAD",
                "name": "Jean de la Croix"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t1.6435-1/p120x120/174193717_125151916321140_7112282634777751777_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeGD-8cn58-7N469IWSHkeCB69OlR-jnsFnr06VH6OewWZ7tkes7WwV4qxdnJNqu4wA&_nc_ohc=_aUqAehkkKMAX8g1eYj&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT9lpjAVfcWWCHXZ74sgIFP2KQSLj5SUgUjGM0VhDDIVNw&oe=61E05DE3",
                "name": "Jean De la Croix"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t1.6435-1/c0.0.120.120a/p120x120/176012632_485890195789362_1394821408027432626_n.jpg?_nc_cat=104&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeGPe9_igvU4crZuwXuYi3Z_VLuk7Myf7EtUu6TszJ_sS6XVsYUG3iK5n6lVOQ0Ex-o&_nc_ohc=lvHkcD4wBmMAX9a2HyY&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT8d1AW5XThdO0SL_JmLO-Vmwol1RMshJOyzxthrAm1vGw&oe=61DE7D5D",
                "name": "Jean De la Croix"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/c0.0.120.120a/p120x120/248688197_124454949968270_1066281725213091879_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeE4x7RfW_x7pzJhWNrFzNhdeKsXjnfMM6V4qxeOd8wzpW85ICZgCqOcWVqJNKpHaEs&_nc_ohc=fAJ16uzrS00AX863h5O&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT8xm2lnkuos3duQodcx56C2LGCgXup7yOQEAj0kzPk6Ag&oe=61BE78FF",
                "name": "JeandelaCroix Raharimandresy"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/p120x120/227217017_131913385765543_4014391124200694085_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeEsXk-aqjkvC_wIaUzNyaWeyUFBHQXqDqHJQUEdBeoOobyJ_su6oeXkEaw0Kro1W7c&_nc_ohc=pkoY-GjSx2oAX9kjOP8&tn=CYYdRK0f9x2LFUmi&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT-S-rLzw_9PVkvJVn-ewpg6iZcuouoCAW3QoaqAaKfroA&oe=61BDE357",
                "name": "Jean De la Croix"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t1.6435-1/p120x120/75557510_105748260894613_7699128086700228608_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeGZBnIcvDo99jzD3gxB_WP5Va2Wa-6WCANVrZZr7pYIAweS1twfDuo724HMw3oaOPE&_nc_ohc=IteVNRSeaUUAX9y2o18&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT_ZufFVmK2NQXWcMrf1VAf4XEz72Te_Uf5Pw_FJM4SNwA&oe=61DEC9E9",
                "name": "Jean De Le Croix"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/p120x120/244626388_957231634862483_5425582713856188260_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeG6KIeAcDQLk3RukJz5n2sJ0WnXWtEtZ-bRadda0S1n5tKp5EZ5e27PRLW31IpMKw0&_nc_ohc=T3G_h6Vp8OcAX_XqHMp&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT8FkmtPDlzPX7oJcqhpKfjFEMTpT2sgX1_q29UVleKLPA&oe=61BD91F0",
                "name": "Jean De Lacroix Andriantsitohaina"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/c0.0.120.120a/p120x120/263537690_211503637812357_4815584770495837761_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeGsX4QYDC-dK7tydNN-ihv27hAqbJQ9Qq3uECpslD1CrelfvGGn6pfkvPXD3b-DkJE&_nc_ohc=gLehxA0CN-MAX8vqgSY&_nc_oc=AQmGqsI77qprCxeIo09gplmsqsMlCzQPsAmaLa83j9rHlz2qyhiPADtezqe8Ko6QUHA&tn=CYYdRK0f9x2LFUmi&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT8D-mjDvt3JLk83jnBYcDMVYPKvltqqspV34RMlmVATjA&oe=61BCF336",
                "name": "Jean De Laloni Henintsoa"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/c0.4.120.120a/p120x120/240668191_322687919605527_601520297610931941_n.jpg?_nc_cat=111&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeFvOsgfMSbRyUx8ERCEFt_pyCGW7YXklTHIIZbtheSVMdtP83opzwi9l8B17g4_s-o&_nc_ohc=GTCI-rupg18AX-L74zb&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT9BgOpLmhWryRK5Pl1dH1dQfqpR7labU665it5ddJd_aw&oe=61BE30EA",
                "name": "Jean Delacroix Miaritra"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/p120x120/236361375_345794420547235_7745706673324881431_n.jpg?_nc_cat=102&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeHFgdlebuM6sYHqgJ8dfIr8jiWln03xWNeOJaWfTfFY15OUbffFmA9LuODiQfjXlRs&_nc_ohc=YStTaO5I9FcAX_Arnlh&tn=CYYdRK0f9x2LFUmi&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT91a2eBSvD-ebBci-cSNaCc700vf6XsfrcvB80pkowuGA&oe=61BE4F46",
                "name": "Jean De Dieu Randrianasolo"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/c0.0.120.120a/p120x120/266328408_618928422893453_7301706949877128420_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeHyCzcFBL_xRtTmWAXvERwnaC32uOi4P5VoLfa46Lg_lV-QVKQDzV7PQIEvTiQboIg&_nc_ohc=4ZzRrYaP6E0AX-z3KZR&tn=CYYdRK0f9x2LFUmi&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT-IzoO78gc2GsVz7P2NQBsKIRyGxRtD3-MB_Mqcw63MJg&oe=61BED2A6",
                "name": "Jean De Lacr Randrianatoandro"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/p120x120/242550061_105061085269796_5201516088072641440_n.jpg?_nc_cat=110&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeG7UVF0XdAEC6NboQZKCkUgAxddSGKR5NgDF11IYpHk2OCgeWkZdm7NK-AYY_w7ZE8&_nc_ohc=MHEf_cDU4UkAX_O3y0q&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT8H4hzxHmYvQfGVe9jVBuCiKcrHUvdjwnpg4QoGdn83UA&oe=61BDD9DE",
                "name": "Andrianasoloniony Jean Dl Croix"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/p120x120/259761236_1067104407403466_508563636903249966_n.jpg?_nc_cat=107&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeGCULj2VuH0dqolAzJvtZBZwdMn5Y5LS0XB0yfljktLRc4JwOK9ODgPL1eb-TJhrfo&_nc_ohc=jaZJLvY26OoAX_HOVUA&tn=CYYdRK0f9x2LFUmi&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT94OsXmBYAJfxBH57mX7AyeKylROoGBtOqX38RkofYrdg&oe=61BE312F",
                "name": "Van'ella Deranirina Layone"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/c0.0.120.120a/p120x120/245665881_1245782319224204_970611972351024121_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeFJqfj1LF5pPGT7EVGw_64xCwJ_pEeo3VELAn-kR6jdUcBpPX1XY1BUgtqh8XhHwfU&_nc_ohc=MaqgVPleA28AX9xfwnA&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT-nd5AwTandSsa5baitsaWGPASN4PMePHwGBqoW97_u1Q&oe=61BED16A",
                "name": "Jésulène Jéanne"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/p120x120/267404503_433597991612104_9031431820931090311_n.jpg?_nc_cat=107&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeFRKs14ACYV71mfvxDoPVSXcpEItXGWzZpykQi1cZbNmq6zKsGi3kbeOLHOIuZv968&_nc_ohc=BylP1n8qpWgAX-gYStB&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT-BuHwnqDSDvTa2mXUPgteW_4aXOX1EIOQfiA3FnsedAg&oe=61BE5AF1",
                "name": "Jeannot Randrianantenaina"
            }
        ]
    },
    {
        "url": "https://web.facebook.com/groups/166490663530746/members",
        "title": "KATESIZIN'NY FIANGONANA KATOLIKA (CATÉCHISME DE L'ÉGLISE CATHOLIQUE)",
        "members": [
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/c0.0.120.120a/p120x120/221930622_109594081412929_521664972456431438_n.jpg?_nc_cat=111&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeF7YZxNa_dO9lblXqNecuQ8w4zW07QhY87DjNbTtCFjzpUTfsndsViMWxegeORKNhk&_nc_ohc=RUN8W9JaxnoAX_kR6Sr&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT87ByDxPaVs40cx1HUUc91mtXTbNnfoD2dBdElHy21ZhA&oe=61BDD9BF",
                "name": "La Croix Jean De"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/c0.0.120.120a/p120x120/248688197_124454949968270_1066281725213091879_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeE4x7RfW_x7pzJhWNrFzNhdeKsXjnfMM6V4qxeOd8wzpW85ICZgCqOcWVqJNKpHaEs&_nc_ohc=fAJ16uzrS00AX863h5O&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT8xm2lnkuos3duQodcx56C2LGCgXup7yOQEAj0kzPk6Ag&oe=61BE78FF",
                "name": "JeandelaCroix Raharimandresy"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t1.6435-1/p120x120/139034995_402465827726043_1837483944574908232_n.jpg?_nc_cat=111&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeE1w8eCvBpGoKtIvTKbiOUjFwgPRLXsIHAXCA9EtewgcHEFIOm-OJfrD6xA9w8EmRs&_nc_ohc=mDKlghY2szsAX_zFTjn&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT9nVYyLmwoUviqQyByScH6uJ7GNDzVJ89Risio7qo0YFg&oe=61DF1686",
                "name": "Jean De Landry Rafanomezantsoa"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/p120x120/236361375_345794420547235_7745706673324881431_n.jpg?_nc_cat=102&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeHFgdlebuM6sYHqgJ8dfIr8jiWln03xWNeOJaWfTfFY15OUbffFmA9LuODiQfjXlRs&_nc_ohc=YStTaO5I9FcAX_Arnlh&tn=CYYdRK0f9x2LFUmi&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT91a2eBSvD-ebBci-cSNaCc700vf6XsfrcvB80pkowuGA&oe=61BE4F46",
                "name": "Jean De Dieu Randrianasolo"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/c0.0.120.120a/p120x120/266328408_618928422893453_7301706949877128420_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeHyCzcFBL_xRtTmWAXvERwnaC32uOi4P5VoLfa46Lg_lV-QVKQDzV7PQIEvTiQboIg&_nc_ohc=4ZzRrYaP6E0AX-z3KZR&tn=CYYdRK0f9x2LFUmi&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT-IzoO78gc2GsVz7P2NQBsKIRyGxRtD3-MB_Mqcw63MJg&oe=61BED2A6",
                "name": "Jean De Lacr Randrianatoandro"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t1.6435-1/c0.0.120.120a/p120x120/69575284_650109778812271_3786922331885010944_n.jpg?_nc_cat=100&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeHsNtPkSS7QWvDpUywufuABWH3bog-zWbRYfduiD7NZtHgfU5ZfZlKOvdI8rOSfSts&_nc_ohc=0znIlyGSzBYAX8HYI9m&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT8BR19lMKfbtAf8Jyf2DUz0B8YzxhbqvvrnaI2mB9l2lg&oe=61DCFE57",
                "name": "Lazarivo JHoni Jean"
            }
        ]
    },
    {
        "url": "https://web.facebook.com/groups/Hira.Katolika/members",
        "title": "MP3,MP4 HIRA KATOLIKA",
        "members": [
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/c0.4.120.120a/p120x120/249550603_400648305106576_6700807122276994112_n.jpg?_nc_cat=100&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeE2FinOSCB0hYujK19yGbrpanHeY80-K7hqcd5jzT4ruImz7qPByNneH4A8yRKUC9M&_nc_ohc=KuB5hxAKkrsAX86NURp&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT-5VSHLcb7j-9lYjtt27yEhJ4TrM42YIu5sRA5yrPDBhQ&oe=61BD7FB5",
                "name": "Jean DE LA Croix"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/p120x120/241745920_1241701153014845_9213249438956823915_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeF9YGIzj5Axlrvm_8UmwVsH7Ryx9-hypijtHLH36HKmKBtpe4Y5Z7O-Khg9ES71bxI&_nc_ohc=TsZgRh-bsroAX8X0O9x&tn=CYYdRK0f9x2LFUmi&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT9eXnAdjOwP-SWC-rsdc-zXpIxOOGGbh22TU3konKrjCQ&oe=61BD5F9C",
                "name": "Jean De la Croix"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t1.6435-1/c0.4.120.120a/p120x120/190616632_1421044211593848_1671706430130577068_n.jpg?_nc_cat=111&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeHAs0sVeVpM_HUD3qYH1bVmaluTubaVOpxqW5O5tpU6nGXW7zc4x1iKX6LbgKeK2Gg&_nc_ohc=L4PT9XqlvK8AX_-Hb-A&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT_c5QCrDMxfCWxsdMLh-ury97BaciwMkOxuUlU9sJBNyw&oe=61DED08A",
                "name": "Jean de la Croix"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/c0.0.120.120a/p120x120/241879856_950616422188591_2653384378210769195_n.jpg?_nc_cat=103&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeHBTHRzgxUYOib5xD7pGoLj-ftcALMrpV_5-1wAsyulXz6QTiUmj_DntdF3IomyGRs&_nc_ohc=LpS5zNgJGpEAX9o6xlr&_nc_oc=AQmToXfrbUktCjKdHCVmDhuSkcmnnryUEqeBFGbfVCt2Yj6BH1kWDTJU47_FR4OFy9w&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT97skJHq5ziYg-5ZLc9sS0WcMaCx1Oleh5DM67ChiSssg&oe=61BCEF30",
                "name": "Jean de la Croix"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t1.6435-1/c20.0.120.120a/p120x120/210372234_521997602488695_7852868173660635330_n.jpg?_nc_cat=100&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeFG5qFL6kPUwjCupzYR_k-yG21e_V9S490bbV79X1Lj3YMyfq4E57tKhN9bR7-a11A&_nc_ohc=cHGQs4CNTMQAX9PdfCh&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT8yTxArqFIam8LPuOJe7_tfiJwvCgXsPs8e9nqspOKhJw&oe=61DDAEAD",
                "name": "Jean de la Croix"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t1.6435-1/c0.4.120.120a/p120x120/119761906_183264323249653_5038736254180002844_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeEEAanIG5K9pEY0D-J6Qo1KwgIfu8FIr3TCAh-7wUivdJIzgODyPRl_UoKyaD3TH4A&_nc_ohc=O528OjIrHkQAX_DGhEl&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT-MgO_BDfvJrKB6JnjfpKIZd4CYYzwqqguFhPlJBypSzQ&oe=61DEF084",
                "name": "Jean de La Croix"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t1.6435-1/c0.0.120.120a/p120x120/176012632_485890195789362_1394821408027432626_n.jpg?_nc_cat=104&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeGPe9_igvU4crZuwXuYi3Z_VLuk7Myf7EtUu6TszJ_sS6XVsYUG3iK5n6lVOQ0Ex-o&_nc_ohc=lvHkcD4wBmMAX9a2HyY&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT8d1AW5XThdO0SL_JmLO-Vmwol1RMshJOyzxthrAm1vGw&oe=61DE7D5D",
                "name": "Jean De la Croix"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/c0.0.120.120a/p120x120/248688197_124454949968270_1066281725213091879_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeE4x7RfW_x7pzJhWNrFzNhdeKsXjnfMM6V4qxeOd8wzpW85ICZgCqOcWVqJNKpHaEs&_nc_ohc=fAJ16uzrS00AX863h5O&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT8xm2lnkuos3duQodcx56C2LGCgXup7yOQEAj0kzPk6Ag&oe=61BE78FF",
                "name": "JeandelaCroix Raharimandresy"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/c0.0.120.120a/p120x120/221930622_109594081412929_521664972456431438_n.jpg?_nc_cat=111&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeF7YZxNa_dO9lblXqNecuQ8w4zW07QhY87DjNbTtCFjzpUTfsndsViMWxegeORKNhk&_nc_ohc=RUN8W9JaxnoAX_kR6Sr&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT87ByDxPaVs40cx1HUUc91mtXTbNnfoD2dBdElHy21ZhA&oe=61BDD9BF",
                "name": "La Croix Jean De"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t1.6435-1/c0.4.120.120a/p120x120/130041042_1663883547152896_7943508740733329341_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeEEEMI27z28LnSPsh-TjvsvAybJX8ELzNQDJslfwQvM1F9MM8gu1Tb4Cnhmdgrw8_g&_nc_ohc=y013GApxyZ8AX9JcwUn&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT_2EDtwdPClPPk4uaIzcbOpbIPQaXM_03fk9ZjSi53PhQ&oe=61DCC27C",
                "name": "Jean Delacroix Ranaivoson"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t1.6435-1/p120x120/91942851_117735513208262_5070198232819171328_n.jpg?_nc_cat=106&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeFk-cWfx2S5362VVHngmCwA12YCUMObvP7XZgJQw5u8_q5C2R8r3_8FtnPhPdYstHI&_nc_ohc=1WVJbgKYC2IAX_Rb6xc&tn=CYYdRK0f9x2LFUmi&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT8qBhRWa5d4TmIH0hfna44ft1-DV5ODR_9WKw4pK2eeXw&oe=61E00683",
                "name": "Jean Lacroix"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/p120x120/244626388_957231634862483_5425582713856188260_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeG6KIeAcDQLk3RukJz5n2sJ0WnXWtEtZ-bRadda0S1n5tKp5EZ5e27PRLW31IpMKw0&_nc_ohc=T3G_h6Vp8OcAX_XqHMp&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT8FkmtPDlzPX7oJcqhpKfjFEMTpT2sgX1_q29UVleKLPA&oe=61BD91F0",
                "name": "Jean De Lacroix Andriantsitohaina"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/c0.0.120.120a/p120x120/263537690_211503637812357_4815584770495837761_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeGsX4QYDC-dK7tydNN-ihv27hAqbJQ9Qq3uECpslD1CrelfvGGn6pfkvPXD3b-DkJE&_nc_ohc=gLehxA0CN-MAX8vqgSY&_nc_oc=AQmGqsI77qprCxeIo09gplmsqsMlCzQPsAmaLa83j9rHlz2qyhiPADtezqe8Ko6QUHA&tn=CYYdRK0f9x2LFUmi&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT8D-mjDvt3JLk83jnBYcDMVYPKvltqqspV34RMlmVATjA&oe=61BCF336",
                "name": "Jean De Laloni Henintsoa"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t1.6435-1/c0.0.120.120a/p120x120/178211651_819570802101361_8361465108340947029_n.jpg?_nc_cat=110&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeE-adkMqtuxXpb3l0261n8z6vmPkXvjqGnq-Y-Re-OoaaSS_9mJCoR0VdWNgvywNBo&_nc_ohc=CX0ZtaX0tLQAX8JEWb9&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT-x5KvSupu1Zr1nFQ8AA3kLn4Y87NDRqy_Z1VcwCBMd7Q&oe=61DD18A1",
                "name": "Yorogang de la Mada"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/c0.0.120.120a/p120x120/233251246_1191322431349819_9082230260847337416_n.jpg?_nc_cat=111&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeHFj4zoCaybEzhsKehe67jzHtVORBeN0qYe1U5EF43SpnMFmqkXl0DY5Hdn8-7v9eY&_nc_ohc=bj5QwmlI5n0AX_iRSGe&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT9L-h_-3gYAn9AXvDiV5WAKMKP8sCeVExlCU4LEt7p8LQ&oe=61BD05B2",
                "name": "Randrianatoandro Jean Delacroix"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/c0.0.120.120a/p120x120/233572818_1022904448474493_3869061240056740236_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeHVJsh-f8MP2muK8t4KMY_95SSx45ATwnrlJLHjkBPCemTTf5xBeTdREz-_uSVB_CE&_nc_ohc=0hVTtokj02UAX9gSMPZ&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT9aaU47zsKw_3xc1NVaYS5FOEyURoODtAbkuHaMBX6L0Q&oe=61BD2C7A",
                "name": "De La Croix Paul"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t1.30497-1/p120x120/143086968_2856368904622192_1959732218791162458_n.png?_nc_cat=1&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeFjzxPp-Vy0NwfN0Wv4Rzulso2H55p0AlGyjYfnmnQCUd8KX4nAFxPKiZzwpf4dD7w&_nc_ohc=YlLqxvkVFBwAX8rh2pL&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT8CU4X9slygc7f6t9p3E5ms4es0PrYnc4Y04w-zvyLALA&oe=61DF0113",
                "name": "Fanantenana Jean De Lacroix"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/c47.0.120.120a/p120x120/262514798_2035705569965389_6824832920583869091_n.jpg?_nc_cat=106&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeHKCp1ayfY2NflESzEQmOXnbkP71uPwkW5uQ_vW4_CRblRDQ7FzRGnSQQDoWSN0Qn8&_nc_ohc=mryandfduzEAX_f-sRu&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT9ST4Yuf9TMGA3L1cC6OIM7crQyCVkPEE1E1HNDvB9zKQ&oe=61BCFAD1",
                "name": "Bela Jean Dela Croix"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t1.6435-1/c0.0.120.120a/p120x120/49736924_524271131403922_3843734428404678656_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeEnKEpiLB2TrjpfNCktMDyQE3nmvFdp_g4Teea8V2n-DucBtq1mHTiIpme8Xcrp518&_nc_ohc=HJ9RbyXvhREAX8bmY1L&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT9k-8iJoC2JeRbU9GY7iaxtWdHpiCEjU3fh5ab0l0zaYA&oe=61DFE889",
                "name": "Lanto Jean de Dieu"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t1.6435-1/p120x120/132214651_422620982201490_5453385424856874622_n.jpg?_nc_cat=111&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeEh31B4qwtzItQ0zi5wMcRXjcOHqQmoUPWNw4epCahQ9VTD_UaNGiNqZnSX4JeDc-Q&_nc_ohc=Icg8YxAkLJoAX-g_o5M&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT8aPwGZkz-Zxzt_3KsnA_t0XyE2h5UYNbPhQhh8NIUlNw&oe=61E0606F",
                "name": "Jean DE Dieu Randriatomady"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/p120x120/236361375_345794420547235_7745706673324881431_n.jpg?_nc_cat=102&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeHFgdlebuM6sYHqgJ8dfIr8jiWln03xWNeOJaWfTfFY15OUbffFmA9LuODiQfjXlRs&_nc_ohc=YStTaO5I9FcAX_Arnlh&tn=CYYdRK0f9x2LFUmi&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT91a2eBSvD-ebBci-cSNaCc700vf6XsfrcvB80pkowuGA&oe=61BE4F46",
                "name": "Jean De Dieu Randrianasolo"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/p120x120/245377424_1272167336596745_7361809944462027551_n.jpg?_nc_cat=103&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeGcyuLdSgsshoGRP4SPJ4zJ-a0i5asB0IH5rSLlqwHQgZa0DR1L7etqAdQmIHE3Hu4&_nc_ohc=n77jwEreW-cAX9c2-C_&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT9CuDAvbvqVK7jheCSfizgq7YxjBYi_Gw5J8wDZLWR1AQ&oe=61BD4D38",
                "name": "Jean Louis De L'anosy"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t1.6435-1/c0.0.120.120a/p120x120/151829528_389258875825731_2738413377461348310_n.jpg?_nc_cat=102&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeHUNRr5vGWeJ9DcSSiHcv6WPZNSeZceVLE9k1J5lx5UsWsierll3uk7mC__3B7hsbc&_nc_ohc=oh1NB1R3oi4AX9yIF72&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT_XpzSrzfWQvUgpQYUvxQibKg4D4Qq7HuzgLdOhj5SN8w&oe=61DCBD67",
                "name": "Jean De Dieu Lahatra"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/c0.0.120.120a/p120x120/266328408_618928422893453_7301706949877128420_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeHyCzcFBL_xRtTmWAXvERwnaC32uOi4P5VoLfa46Lg_lV-QVKQDzV7PQIEvTiQboIg&_nc_ohc=4ZzRrYaP6E0AX-z3KZR&tn=CYYdRK0f9x2LFUmi&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT-IzoO78gc2GsVz7P2NQBsKIRyGxRtD3-MB_Mqcw63MJg&oe=61BED2A6",
                "name": "Jean De Lacr Randrianatoandro"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t1.6435-1/c0.0.120.120a/p120x120/69575284_650109778812271_3786922331885010944_n.jpg?_nc_cat=100&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeHsNtPkSS7QWvDpUywufuABWH3bog-zWbRYfduiD7NZtHgfU5ZfZlKOvdI8rOSfSts&_nc_ohc=0znIlyGSzBYAX8HYI9m&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT8BR19lMKfbtAf8Jyf2DUz0B8YzxhbqvvrnaI2mB9l2lg&oe=61DCFE57",
                "name": "Lazarivo JHoni Jean"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/p120x120/242550061_105061085269796_5201516088072641440_n.jpg?_nc_cat=110&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeG7UVF0XdAEC6NboQZKCkUgAxddSGKR5NgDF11IYpHk2OCgeWkZdm7NK-AYY_w7ZE8&_nc_ohc=MHEf_cDU4UkAX_O3y0q&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT8H4hzxHmYvQfGVe9jVBuCiKcrHUvdjwnpg4QoGdn83UA&oe=61BDD9DE",
                "name": "Andrianasoloniony Jean Dl Croix"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/c0.0.120.120a/p120x120/243274327_543341316763146_207041632989809022_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeGNWgaEoqNL8KTmlByPLDD-nTdcxoMGi-adN1zGgwaL5m6DnZTlUbG5T6qcZQEuVKM&_nc_ohc=BePboWgDR98AX_AH8dH&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT-4Dqe9J-N_Z_EvAcYz2n7ldmqDdWYl5ACFyuN8I4dXyA&oe=61BDABBA",
                "name": "Randrianantenaina Jean Christian"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/p120x120/267404503_433597991612104_9031431820931090311_n.jpg?_nc_cat=107&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeFRKs14ACYV71mfvxDoPVSXcpEItXGWzZpykQi1cZbNmq6zKsGi3kbeOLHOIuZv968&_nc_ohc=BylP1n8qpWgAX-gYStB&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT-BuHwnqDSDvTa2mXUPgteW_4aXOX1EIOQfiA3FnsedAg&oe=61BE5AF1",
                "name": "Jeannot Randrianantenaina"
            }
        ]
    },
    {
        "url": "https://web.facebook.com/groups/2294703974168363/members",
        "title": "Izaho Katolika 3>",
        "members": [
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t1.6435-1/c20.0.120.120a/p120x120/210372234_521997602488695_7852868173660635330_n.jpg?_nc_cat=100&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeFG5qFL6kPUwjCupzYR_k-yG21e_V9S490bbV79X1Lj3YMyfq4E57tKhN9bR7-a11A&_nc_ohc=cHGQs4CNTMQAX9PdfCh&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT8yTxArqFIam8LPuOJe7_tfiJwvCgXsPs8e9nqspOKhJw&oe=61DDAEAD",
                "name": "Jean de la Croix"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/c0.0.120.120a/p120x120/248688197_124454949968270_1066281725213091879_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeE4x7RfW_x7pzJhWNrFzNhdeKsXjnfMM6V4qxeOd8wzpW85ICZgCqOcWVqJNKpHaEs&_nc_ohc=fAJ16uzrS00AX863h5O&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT8xm2lnkuos3duQodcx56C2LGCgXup7yOQEAj0kzPk6Ag&oe=61BE78FF",
                "name": "JeandelaCroix Raharimandresy"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/c0.4.120.120a/p120x120/217291161_329096892265391_6379426381975061070_n.jpg?_nc_cat=102&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeECK2epVA7AN9JqRs5Wpj1sPpylOKNx1cQ-nKU4o3HVxG7cEObiCTFK_2s2eSITd1I&_nc_ohc=WEfPZqD-RUkAX9NbjZV&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT9_gKhYNCfCYTmMN5PnC4HdWEVTYpWXP89sAkcpEjIEHQ&oe=61BDDA30",
                "name": "Jean De Lacroit"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/p120x120/244626388_957231634862483_5425582713856188260_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeG6KIeAcDQLk3RukJz5n2sJ0WnXWtEtZ-bRadda0S1n5tKp5EZ5e27PRLW31IpMKw0&_nc_ohc=T3G_h6Vp8OcAX_XqHMp&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT8FkmtPDlzPX7oJcqhpKfjFEMTpT2sgX1_q29UVleKLPA&oe=61BD91F0",
                "name": "Jean De Lacroix Andriantsitohaina"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/p120x120/236361375_345794420547235_7745706673324881431_n.jpg?_nc_cat=102&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeHFgdlebuM6sYHqgJ8dfIr8jiWln03xWNeOJaWfTfFY15OUbffFmA9LuODiQfjXlRs&_nc_ohc=YStTaO5I9FcAX_Arnlh&tn=CYYdRK0f9x2LFUmi&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT91a2eBSvD-ebBci-cSNaCc700vf6XsfrcvB80pkowuGA&oe=61BE4F46",
                "name": "Jean De Dieu Randrianasolo"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/c0.0.120.120a/p120x120/233572818_1022904448474493_3869061240056740236_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeHVJsh-f8MP2muK8t4KMY_95SSx45ATwnrlJLHjkBPCemTTf5xBeTdREz-_uSVB_CE&_nc_ohc=0hVTtokj02UAX9gSMPZ&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT9aaU47zsKw_3xc1NVaYS5FOEyURoODtAbkuHaMBX6L0Q&oe=61BD2C7A",
                "name": "De La Croix Paul"
            }
        ]
    },
    {
        "url": "https://web.facebook.com/groups/233859300146316/members",
        "title": "KATOLIKA IRINGIRINY",
        "members": [
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/c0.0.120.120a/p120x120/248688197_124454949968270_1066281725213091879_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeE4x7RfW_x7pzJhWNrFzNhdeKsXjnfMM6V4qxeOd8wzpW85ICZgCqOcWVqJNKpHaEs&_nc_ohc=fAJ16uzrS00AX863h5O&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT8xm2lnkuos3duQodcx56C2LGCgXup7yOQEAj0kzPk6Ag&oe=61BE78FF",
                "name": "JeandelaCroix Raharimandresy"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t1.6435-1/c0.0.120.120a/p120x120/55840610_125528235217065_6679793972103086080_n.jpg?_nc_cat=111&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeHlf-3XMDR6L8eNIsOzh7s8hA09PZuYsYmEDT09m5ixiYyYvjhUVP8UrEj6IDxDSxA&_nc_ohc=SGSWvxdbfMQAX-w2Njf&tn=CYYdRK0f9x2LFUmi&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT8ovON_OrROA7oQKyTDEYNN5TOJp58d4jMIFa3b0Oo95A&oe=61DC960F",
                "name": "Jean De Lacroix Laza"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/c0.0.120.120a/p120x120/242712022_1487405891637438_7752774620299542891_n.jpg?_nc_cat=110&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeEf5dtR7RKKhMnXILPhWiFfZhSVAviIY0VmFJUC-IhjRSLefkCerW_cRzgSS_48pag&_nc_ohc=0Pk1IG-IsmoAX9Rxp00&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT9eQPbooiPEM3t8Ye3unT8eJrvAUf5rL4NRF1FAaXWx8g&oe=61BE6442",
                "name": "Jean de Lakroi"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t1.6435-1/c0.0.120.120a/p120x120/45119267_139227170373877_1413877653017985024_n.jpg?_nc_cat=106&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeFlNRh2St-D4Dpuf6gZQwMkXqzdNFxtWMxerN00XG1YzHVZDXGOHoINFeQ6NFxeXz8&_nc_ohc=sBeHyayxxoYAX-aM3ld&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT8FAeinpjOKtHajtJ-lfU6nKwRHrEg0fT73oTUJs1frCw&oe=61DD3523",
                "name": "Jean De Lacroix Lazaniaina"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/p120x120/236361375_345794420547235_7745706673324881431_n.jpg?_nc_cat=102&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeHFgdlebuM6sYHqgJ8dfIr8jiWln03xWNeOJaWfTfFY15OUbffFmA9LuODiQfjXlRs&_nc_ohc=YStTaO5I9FcAX_Arnlh&tn=CYYdRK0f9x2LFUmi&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT91a2eBSvD-ebBci-cSNaCc700vf6XsfrcvB80pkowuGA&oe=61BE4F46",
                "name": "Jean De Dieu Randrianasolo"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/c0.0.120.120a/p120x120/233251246_1191322431349819_9082230260847337416_n.jpg?_nc_cat=111&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeHFj4zoCaybEzhsKehe67jzHtVORBeN0qYe1U5EF43SpnMFmqkXl0DY5Hdn8-7v9eY&_nc_ohc=bj5QwmlI5n0AX_iRSGe&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT9L-h_-3gYAn9AXvDiV5WAKMKP8sCeVExlCU4LEt7p8LQ&oe=61BD05B2",
                "name": "Randrianatoandro Jean Delacroix"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t1.6435-1/c0.0.120.120a/p120x120/69575284_650109778812271_3786922331885010944_n.jpg?_nc_cat=100&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeHsNtPkSS7QWvDpUywufuABWH3bog-zWbRYfduiD7NZtHgfU5ZfZlKOvdI8rOSfSts&_nc_ohc=0znIlyGSzBYAX8HYI9m&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT8BR19lMKfbtAf8Jyf2DUz0B8YzxhbqvvrnaI2mB9l2lg&oe=61DCFE57",
                "name": "Lazarivo JHoni Jean"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/p120x120/259761236_1067104407403466_508563636903249966_n.jpg?_nc_cat=107&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeGCULj2VuH0dqolAzJvtZBZwdMn5Y5LS0XB0yfljktLRc4JwOK9ODgPL1eb-TJhrfo&_nc_ohc=jaZJLvY26OoAX_HOVUA&tn=CYYdRK0f9x2LFUmi&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT94OsXmBYAJfxBH57mX7AyeKylROoGBtOqX38RkofYrdg&oe=61BE312F",
                "name": "Van'ella Deranirina Layone"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t1.18169-1/c30.0.120.120a/p120x120/28377633_187605685347748_7223402134672105107_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeEiWQYpQneQ0hNrgQBmbDvyQycZYG3vXIdDJxlgbe9ch2c3stNBEV70dJUTNJlIVPA&_nc_ohc=OhweFn6qPgAAX8fDq64&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT-NuqI5gTLmMY-8E5ab3ASkyXJCIvEBoptt1frLaeBniw&oe=61DD4CEE",
                "name": "Jean Desire Lalaina"
            }
        ]
    },
    {
        "url": "https://web.facebook.com/groups/729025503897150/members",
        "title": "KATOLIKA 100%  (Y) <3 [ EKAR]",
        "members": [
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t1.6435-1/c0.4.120.120a/p120x120/190616632_1421044211593848_1671706430130577068_n.jpg?_nc_cat=111&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeHAs0sVeVpM_HUD3qYH1bVmaluTubaVOpxqW5O5tpU6nGXW7zc4x1iKX6LbgKeK2Gg&_nc_ohc=L4PT9XqlvK8AX_-Hb-A&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT_c5QCrDMxfCWxsdMLh-ury97BaciwMkOxuUlU9sJBNyw&oe=61DED08A",
                "name": "Jean de la Croix"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/c0.0.120.120a/p120x120/248688197_124454949968270_1066281725213091879_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeE4x7RfW_x7pzJhWNrFzNhdeKsXjnfMM6V4qxeOd8wzpW85ICZgCqOcWVqJNKpHaEs&_nc_ohc=fAJ16uzrS00AX863h5O&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT8xm2lnkuos3duQodcx56C2LGCgXup7yOQEAj0kzPk6Ag&oe=61BE78FF",
                "name": "JeandelaCroix Raharimandresy"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t1.6435-1/c0.0.120.120a/p120x120/55840610_125528235217065_6679793972103086080_n.jpg?_nc_cat=111&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeHlf-3XMDR6L8eNIsOzh7s8hA09PZuYsYmEDT09m5ixiYyYvjhUVP8UrEj6IDxDSxA&_nc_ohc=SGSWvxdbfMQAX-w2Njf&tn=CYYdRK0f9x2LFUmi&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT8ovON_OrROA7oQKyTDEYNN5TOJp58d4jMIFa3b0Oo95A&oe=61DC960F",
                "name": "Jean De Lacroix Laza"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/p120x120/244626388_957231634862483_5425582713856188260_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeG6KIeAcDQLk3RukJz5n2sJ0WnXWtEtZ-bRadda0S1n5tKp5EZ5e27PRLW31IpMKw0&_nc_ohc=T3G_h6Vp8OcAX_XqHMp&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT8FkmtPDlzPX7oJcqhpKfjFEMTpT2sgX1_q29UVleKLPA&oe=61BD91F0",
                "name": "Jean De Lacroix Andriantsitohaina"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/c47.0.120.120a/p120x120/262514798_2035705569965389_6824832920583869091_n.jpg?_nc_cat=106&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeHKCp1ayfY2NflESzEQmOXnbkP71uPwkW5uQ_vW4_CRblRDQ7FzRGnSQQDoWSN0Qn8&_nc_ohc=mryandfduzEAX_f-sRu&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT9ST4Yuf9TMGA3L1cC6OIM7crQyCVkPEE1E1HNDvB9zKQ&oe=61BCFAD1",
                "name": "Bela Jean Dela Croix"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t1.6435-1/p120x120/139034995_402465827726043_1837483944574908232_n.jpg?_nc_cat=111&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeE1w8eCvBpGoKtIvTKbiOUjFwgPRLXsIHAXCA9EtewgcHEFIOm-OJfrD6xA9w8EmRs&_nc_ohc=mDKlghY2szsAX_zFTjn&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT9nVYyLmwoUviqQyByScH6uJ7GNDzVJ89Risio7qo0YFg&oe=61DF1686",
                "name": "Jean De Landry Rafanomezantsoa"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/c0.0.120.120a/p120x120/233251246_1191322431349819_9082230260847337416_n.jpg?_nc_cat=111&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeHFj4zoCaybEzhsKehe67jzHtVORBeN0qYe1U5EF43SpnMFmqkXl0DY5Hdn8-7v9eY&_nc_ohc=bj5QwmlI5n0AX_iRSGe&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT9L-h_-3gYAn9AXvDiV5WAKMKP8sCeVExlCU4LEt7p8LQ&oe=61BD05B2",
                "name": "Randrianatoandro Jean Delacroix"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t39.30808-1/c0.0.120.120a/p120x120/238399062_550846599482327_4933708608849999021_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeEtyH-AxHZ0igO7bomL6xkZAOCBBGJvsVcA4IEEYm-xVx9skqcZzcrDvRMJEhDhSco&_nc_ohc=NK3WwdsTm98AX_iXSPm&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT_wdJOkve6kC_N6wta8Xj6JcvksVcp0oQ7jsbNnesfpwg&oe=61BD94AD",
                "name": "Anaïs Gerishya"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t1.6435-1/c0.0.120.120a/p120x120/148177854_2939882179577475_8386686237875265235_n.jpg?_nc_cat=102&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeEY6belnP8SDdBaiTqPK_3Mpkzbob_M4vymTNuhv8zi_CJNI7pklJbIiLfi6IjOu1E&_nc_ohc=eH2QvjypvFIAX_THzgU&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT9jg6UTS0vOfV46tkAvgsrTijIS3pMhETPSA3rEuTzu2Q&oe=61DCEFA9",
                "name": "Azaz Magnaja Anao"
            },
            {
                "picture": "https://scontent.ftnr2-1.fna.fbcdn.net/v/t1.18169-1/c30.0.120.120a/p120x120/28377633_187605685347748_7223402134672105107_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=7206a8&_nc_eui2=AeEiWQYpQneQ0hNrgQBmbDvyQycZYG3vXIdDJxlgbe9ch2c3stNBEV70dJUTNJlIVPA&_nc_ohc=OhweFn6qPgAAX8fDq64&_nc_ht=scontent.ftnr2-1.fna&oh=00_AT-NuqI5gTLmMY-8E5ab3ASkyXJCIvEBoptt1frLaeBniw&oe=61DD4CEE",
                "name": "Jean Desire Lalaina"
            }
        ]
    }
];

groups.map(group=>{
    group.members.map(member=>{
        const file = fs.createWriteStream("fbgroups/"+member.name+".jpg");
        const request = https.get(member.picture, function(response) {
            response.pipe(file);
        });
    })
})

