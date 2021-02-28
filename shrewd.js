const Discord = require("discord.js"); // Shréwd 
const client = new Discord.Client(); 
const ayarlar = require("./ayarlar.json"); 
const chalk = require("chalk"); 
const moment = require("moment"); 
var Jimp = require("jimp"); 
const { Client, Util } = require("discord.js"); 
const fs = require("fs"); 
const db = require("quick.db");
const express = require("express");   
require("./util/eventLoader.js")(client); // Shréwd 
const path = require("path"); 
const snekfetch = require("snekfetch");  
const ms = require("ms"); 
const tags = require("common-tags");

var prefix = ayarlar.prefix;  // Shréwd 

const log = message => {
  
  console.log(`${message}`); 
};

client.commands = new Discord.Collection(); 
client.aliases = new Discord.Collection(); 
fs.readdir("./komutlar/", (err, files) => { // Shréwd 
  
  if (err) console.error(err); 
  
  log(` ${files.length} Botun komutları yüklenecek...`); 
  files.forEach(f => {
    
    let props = require(`./komutlar/${f}`);  // Shréwd 
    log(`[KOMUT] | ${props.help.name} Eklendi.`); 
    client.commands.set(props.help.name, props); 
    props.conf.aliases.forEach(alias => {
      
      client.aliases.set(alias, props.help.name); 
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => { // Shréwd 
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name); // Shréwd 
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => { // Shréwd 
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`); // Shréwd 
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)]; // Shréwd 
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias); // Shréwd 
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }

  let permlvl = 0; // Shréwd 
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted"))); // Shréwd 
});
client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

client.login(ayarlar.token); // process.env.token ltfn

//------------------------------------------------------SA-AS------------------------------------------------------\\

client.on("message", message => {
  if(message.content.toLowerCase() === "sea")
   return message.reply("Aleyküm Selam Hoşgeldin!")
});

client.on("message", message => {
  if(message.content.toLowerCase() === "sa")
   return message.reply("Aleyküm Selam Hoşgeldin!")
});

client.on("message", message => {
  if(message.content.toLowerCase() === "s.a")
   return message.reply("Aleyküm Selam Hoşgeldin!")
});

client.on("message", message => {
  if(message.content.toLowerCase() === "slm")
   return message.reply("Aleyküm Selam Hoşgeldin!")
});

client.on("message", message => {
  if(message.content.toLowerCase() === "selam")
   return message.reply("Aleyküm Selam Hoşgeldin!")
});

client.on("message", message => {
  if(message.content.toLowerCase() === "selamun aleyküm")
   return message.reply("Aleyküm Selam Hoşgeldin!")
});

client.on("message", message => {
  if(message.content.toLowerCase() === "tag")
   return message.channel.send(`TAGINIZ`)
});

client.on("message", message => {
  if(message.content.toLowerCase() === ".tag")
   return message.channel.send(`TAGINIZ`)
});

client.on("message", message => {
  if(message.content.toLowerCase() === "!tag")
   return message.channel.send(`TAGINIZ`)
});


client.on("guildMemberAdd", member => {
    const girisaq = member.guild.channels.cache.find(giris => giris.id === "KANAL ID");

    const embed = new Discord.MessageEmbed()
    .setDescription(`${member} Sunucumuza Hoşgeldin Umarım Keyifli Vakit Geçirirsin 🥳`)
     girisaq.send(embed)
  });

client.on("guildMemberRemove", member => {
    const cikisaq = member.guild.channels.cache.find(cikis => cikis.id === "KANAL ID");
    
    const embed2 = new Discord.MessageEmbed()
    .setDescription(`${member} Sunucumuzdan Ayrıldı Keşke Ayrılmasaydı 🤔`)
     cikisaq.send(embed2)
   });

client.on("guildMemberAdd", member => {
    let rol = member.guild.roles.cache.find(role => role.id === "OTOROL ID");
    member.roles.add(rol);
  });

  //------------------------------------------------------SA-AS--------------------------------------------------------\\

  //--------------------------------------------------------MESSAGE-LOG--------------------------------------------------------\\

  client.on("messageDelete", function (message) {

   if(message.author.bot) return;

   let embed = new Discord.MessageEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true}))
    .setDescription(`
    
      **Mesajı Silen Kişi:**
      -> <@${message.author.id}>
      **Silinen Mesaj**
      -> ${message.content}`)

      .setTimestamp()
      .setColor("#ff000")
      .setFooter("Kullanıcı: " + message.author.username + " | Sunucu " + message.guild.name);

      client.channels.cache
      .get(ayarlar.kanal)
      .send(embed)
  });

  client.on("messageUpdate", function (oldMsg, newMsg) {
    
    if(newMsg.author.bot) return;

    let embed = new Discord.MessageEmbed()
     .setAuthor(newMsg.author.tag, newMsg.author.avatarURL({ dynamic: true }))
     .setDescription(`
     
      **Mesaj Sahibi**
      ->  <@${newMsg.author.id}>
      **Mesaj Linki**
      ->  [Tıkla](${newMsg.url}) 
      **Eski Mesaj**
      ->  ${oldMsg.content}
      **Yeni Mesaj**
      ->  ${newMsg.content}`)

      .setTimestamp()
      .setColor("#ff000")
      .setFooter("Kullanıcı: " + newMsg.author.username + " | Sunucu: " + newMsg.guild.name);

      client.channels.cache
       .get(ayarlar.kanal)
       .send(embed)
  });

  //--------------------------------------------------------MESSAGE-LOG------------------------------------------------------\\

 //----------------------------------------------------BOTU-SESE-SOKMA------------------------------------------------------\\

  client.on("ready", async function () {
    const voiceChannel = ayarlar.botcukses;
     client.channels.cache
      .get(voiceChannel)
      .join()
      .catch(err => {
         throw err;
      });
  });

  //------------------------------------------------------BOTU-SESE-SOKMA----------------------------------------------------\\

  //------------------------------------------------------AFK------------------------------------------------------\\

client.on("message", async message => { // sa

let shrewdxd = db.fetch(`afkSebep_${message.author.id}_${message.guild.id}`)

if (!shrewdxd) return;
let shrewd = db.fetch(`afkAd_${message.author.id}_${message.guild.id}`)
 message.member.setNickname(shrewd)

db.delete(`afkSebep_${message.author.id}_${message.guild.id}`)
db.delete(`afkAd_${message.author.id}_${message.guild.id}`)
db.delete(`afkid_${message.author.id}_${message.guild.id}`)
message.channel.send(`${message.author} artık AFK değil.`)

});

 //------------------------------------------------------AFK------------------------------------------------------\\

//------------------------------------------------------AYARLAMALI-REKLAM-ENGEL------------------------------------------------------\\

client.on("message", message => { // Shréwd
  if(!db.has(`reklamlen_${message.guild.id}`)) return;

   const reklamcık = [
    ".com",
    ".net",
    ".xyz",
    ".tk",
    ".pw",
    ".io",
    ".me",
    ".gg",
    "www.",
    "https",
    "http",
    ".gl",
    ".org",
    ".com.tr",
    ".biz",
    "net",
    ".rf.gd",
    ".az",
    ".party",
    "discord.gg"
   ];

   if(reklamcık.some(kelime => message.content.toLowerCase().includes(kelime))) {
    try {

      if(!message.member.hasPermission("ADMINISTRATOR")) { // bu yetkiye sahip olanları etkilemiyor
       message.delete();

        return message.channel.send(new Discord.MessageEmbed()
         .setDescription(`${message.author} Bu sunucuda reklam yapmak yasaktır!`)
         .setColor("RED")
         .setAuthor(message.member.displayName, message.author.avatarURL())
         .setTimestamp())
         .then(x => x.delete({ timeout: 5000 }));  

     }
   } catch (err) {
           console.log(err);
        }
   }
}); // Shréwd

//------------------------------------------------------AYARLAMALI-REKLAM-ENGEL------------------------------------------------------\\

//------------------------------------------------------AYARLAMALI-KÜFÜR-ENGEL------------------------------------------------------\\

client.on("message", message => { // Shréwd
  if(!db.has(`kufurcum_${message.guild.id}`)) return;
  
   const kufurcuk = ["orospu","amık","Oç","0ç","yavşak","y3a3rram","a.m.k","A.M.K","or1spu","anan1 s1k1m","orospu evladı","ananı sikim","anneni sikim","anneni sikeyim","ananı sikeyim","ağzına sıçim","ağzına sıçayım","ağzına s","ambiti","amını","amını s","amcık","amcik","amcığını","amciğini","amcığını","amcığını s","amck","amckskm","amcuk","amına","amına k","amınakoyim","amına s","amunu","amını","amın oğlu","amın o","amınoğlu","amnskm","anaskm","ananskm","amkafa","amk çocuğu","amk oç","piç","amk ç","amcıklar","amq","amındaki","amnskm","ananı","ananın am","ananızın","aneni","aneni s","annen","anen","ananın dölü","sperm","döl","anasının am","anası orospu","orospu","orosp,","kahpe","kahbe","kahße","ayklarmalrmsikerim","ananı avradını","avrat","avradını","avradını s","babanı","babanı s","babanın amk","annenin amk","ananın amk","bacını s","babası pezevenk","pezevenk","pezeveng","kaşar","bitch","yarrak","cibiliyetini","bokbok","bombok","dallama","götünü s","ebenin","ebeni","ecdadını","gavat","gavad","ebeni","fahişe","sürtük","fuck","gotten","götten","göt","gtveren","gttn","gtnde","gtn","hassiktir","hasiktir","hsktr","haysiyetsiz","ibne","ibine","ipne","kaltık","kancık","kevaşe","kevase","kodumun","orosbu","fucker","penis","porno","sikiş","s1kerim","puşt","sakso","skcm","siktir","sktr","skecem","skeym","slaleni","sokam","sokuş","sokarım","sokarm","sokaym","şerefsiz","şrfsz","sürtük","taşak","taşşak","tasak","tipini s","yarram","yararmorospunun","yarramın başı","yarramınbaşı","yarraminbasi","yrrk","zikeyim","zikik","zkym","amk","mk","oç"];
   
   if(kufurcuk.some(kelimeğ => message.content.toLowerCase().includes(kelimeğ))) {
    try {

       if(!message.member.hasPermission("ADMINISTRATOR")) { // bu yetkiye sahip olanları etkilemiyor
        message.delete();

         return message.channel.send(new Discord.MessageEmbed()
          .setDescription(`${message.author} Bu sunucuda küfür etmek yasaktır!`)
          .setColor("RED")
          .setAuthor(message.member.displayName, message.author.avatarURL())
          .setTimestamp())
          .then(x => x.delete({ timeout: 5000}))

        }
      } catch (err) {
              console.log(err);
           }
      }
   }); // Shréwd
   //------------------------------------------------------AYARLAMALI-KÜFÜR-ENGEL------------------------------------------------------\\

//------------------------------------------------------TAG-ALINCA-VERİLECEK-ROL------------------------------------------------------\\

client.on("userUpdate", async (oldUser, newUser) => {
   if(oldUser.username !== newUser.username) {

     let tag = "TAG"; // Tagınız
     let sunucu = "SUNUCU ID"; // Sunucu ID
     let ganal = "KANAL ID"; // Kanal ID
     let rolcük = "ROL ID"; // Tag aldıktan sonra verilecek rol ID


      // TAG ALAN KULLANICI
     if(newUser.username.includes(tag) && !client.guilds.cache 
       .get(sunucu)
       .members.cache.get(newUser.id)
       .roles.cache.has(rolcük)) {


        client.channels.cache
        .get(ganal)
        .send(`${newUser} **\`${tag}\`** tagını aldığı için <@&${rolcük}> rolünü kazandı!`)

        client.guilds.cache
        .get(sunucu)
        .members.cache.get(newUser.id)
        .roles.add(rolcük)

       }

     // TAG SALAN KULLANICI
    if(!newUser.username.includes(tag) && client.guilds.cache 
       .get(sunucu)
       .members.cache.get(newUser.id)
       .roles.cache.has(rolcük)) {


        client.channels.cache
        .get(ganal)
        .send(`${newUser} **\`${tag}\`** tagını isminden çıkardığı için <@&${rolcük}> rolünü kaybetti!`)
        
        client.guilds.cache
        .get(sunucu)
        .members.cache.get(newUser.id)
        .roles.remove(rolcük)

    }   
  }
});

//------------------------------------------------------TAG-ALINCA-VERİLECEK-ROL------------------------------------------------------\\

// İyi Kullanımlar Muah..