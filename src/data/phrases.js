// Curated phrases for the trip. Romaji uses Hepburn + a hyphenated pronunciation
// hint in brackets so anyone can read it without prior Japanese knowledge.
// Format per item: { en, jp, romaji }  where romaji = "Hepburn (hy-phen-ated)"

const PHRASE_GROUPS = [
  {
    id: 'daily',
    label: 'Daily',
    icon: '👋',
    color: '#0ea5e9',
    iconBg: '#e0f2fe',
    items: [
      { en: 'Hello',                   jp: 'こんにちは',                       romaji: 'Konnichiwa (kon-nee-chee-wah)' },
      { en: 'Good morning',            jp: 'おはようございます',                romaji: 'Ohayou gozaimasu (oh-ha-yoh go-zai-mas)' },
      { en: 'Good evening',            jp: 'こんばんは',                       romaji: 'Konbanwa (kon-ban-wah)' },
      { en: 'Thank you very much',     jp: 'ありがとうございます',              romaji: 'Arigatou gozaimasu (ah-ree-ga-toh go-zai-mas)' },
      { en: 'Excuse me / Sorry',       jp: 'すみません',                        romaji: 'Sumimasen (soo-mee-ma-sen)' },
      { en: 'Yes',                     jp: 'はい',                              romaji: 'Hai (hai)' },
      { en: 'No',                      jp: 'いいえ',                            romaji: 'Iie (ee-eh)' },
      { en: 'Please',                  jp: 'お願いします',                      romaji: 'Onegaishimasu (oh-neh-gai-shee-mas)' },
      { en: "I don't understand",      jp: 'わかりません',                      romaji: 'Wakarimasen (wah-ka-ree-ma-sen)' },
      { en: 'Do you speak English?',   jp: '英語を話せますか？',                 romaji: 'Eigo o hanasemasu ka? (ay-go oh ha-na-seh-mas-ka)' },
      { en: 'Do you speak Chinese?',   jp: '中国語を話せますか？',               romaji: 'Chuugokugo o hanasemasu ka? (choo-go-koo-go oh ha-na-seh-mas-ka)' },
      { en: 'Goodbye',                 jp: 'さようなら',                        romaji: 'Sayounara (sa-yoh-na-rah)' },
    ],
  },

  {
    id: 'conbini',
    label: 'Conbini & Shop',
    icon: '🏪',
    color: '#10b981',
    iconBg: '#d1fae5',
    items: [
      { en: 'How much is this?',         jp: 'これはいくらですか？',              romaji: 'Kore wa ikura desu ka? (koh-reh wah ee-koo-rah des-ka)' },
      { en: 'No bag, thanks',            jp: '袋はいりません',                    romaji: 'Fukuro wa irimasen (foo-koo-roh wah ee-ree-ma-sen)' },
      { en: 'Bag please',                jp: '袋をください',                      romaji: 'Fukuro o kudasai (foo-koo-roh oh koo-da-sai)' },
      { en: 'Card payment please',       jp: 'カードでお願いします',              romaji: 'Kaado de onegaishimasu (kah-doh deh oh-neh-gai-shee-mas)' },
      { en: 'Chopsticks please',         jp: 'お箸をください',                    romaji: 'Ohashi o kudasai (oh-ha-shee oh koo-da-sai)' },
      { en: 'Spoon please',              jp: 'スプーンをください',                romaji: 'Supuun o kudasai (spoon oh koo-da-sai)' },
      { en: 'Heat this up please',       jp: '温めてください',                    romaji: 'Atatamete kudasai (ah-ta-ta-meh-teh koo-da-sai)' },
      { en: 'Receipt please',            jp: 'レシートをください',                romaji: 'Reshiito o kudasai (reh-shee-toh oh koo-da-sai)' },
      { en: 'Just looking, thanks',      jp: '見ているだけです',                  romaji: 'Mite iru dake desu (mee-teh ee-roo da-keh des)' },
    ],
  },

  {
    id: 'restaurant',
    label: 'Restaurant',
    icon: '🍜',
    color: '#f59e0b',
    iconBg: '#fef3c7',
    items: [
      { en: 'Two people please',         jp: '二人お願いします',                  romaji: 'Futari onegaishimasu (foo-ta-ree oh-neh-gai-shee-mas)' },
      { en: 'English menu?',             jp: '英語のメニューはありますか？',      romaji: 'Eigo no menyuu wa arimasu ka? (ay-go no meh-nyoo wah ah-ree-mas-ka)' },
      { en: 'This one please (point)',   jp: 'これをください',                    romaji: 'Kore o kudasai (koh-reh oh koo-da-sai)' },
      { en: 'Water please',              jp: 'お水をください',                    romaji: 'Omizu o kudasai (oh-mee-zoo oh koo-da-sai)' },
      { en: 'How much is this?',         jp: 'これはいくらですか？',              romaji: 'Kore wa ikura desu ka? (koh-reh wah ee-koo-rah des-ka)' },
      { en: 'For here',                  jp: '店内で',                            romaji: 'Tennai de (ten-nai deh)' },
      { en: 'Takeaway',                  jp: '持ち帰りで',                        romaji: 'Mochikaeri de (mo-chee-ka-eh-ree deh)' },
      { en: 'Check / Bill please',       jp: 'お会計お願いします',                romaji: 'Okaikei onegaishimasu (oh-kai-keh oh-neh-gai-shee-mas)' },
      { en: 'It was delicious',          jp: 'ごちそうさまでした',                romaji: 'Gochisousama deshita (go-chee-soh-sa-mah desh-ta)' },
    ],
  },

  {
    id: 'dietary',
    label: 'Halal / Vegetarian',
    icon: '🥬',
    color: '#16a34a',
    iconBg: '#dcfce7',
    items: [
      { en: "I'm Muslim (halal only)",      jp: '私はムスリムです。ハラールのみです。',          romaji: 'Watashi wa musurimu desu. Haraaru nomi desu. (wa-ta-shee wah moo-soo-ree-moo des. ha-rah-roo no-mee des)' },
      { en: "I'm vegetarian",                jp: '私はベジタリアンです',                          romaji: 'Watashi wa bejitarian desu (wa-ta-shee wah beh-jee-ta-ree-an des)' },
      { en: 'No pork please',                jp: '豚肉抜きでお願いします',                        romaji: 'Butaniku nuki de onegaishimasu (boo-ta-nee-koo noo-kee deh oh-neh-gai-shee-mas)' },
      { en: 'No alcohol please',             jp: 'アルコール抜きでお願いします',                  romaji: 'Arukooru nuki de onegaishimasu (ah-roo-koh-roo noo-kee deh oh-neh-gai-shee-mas)' },
      { en: 'No mirin / cooking sake',       jp: 'みりんと料理酒も抜いてください',                romaji: 'Mirin to ryouri-shu mo nuite kudasai (mee-reen toh ryoh-ree-shoo mo noo-ee-teh koo-da-sai)' },
      { en: 'Does this contain pork?',       jp: 'これは豚肉が入っていますか？',                  romaji: 'Kore wa butaniku ga haitte imasu ka? (koh-reh wah boo-ta-nee-koo gah hai-teh ee-mas-ka)' },
      { en: 'Does this contain alcohol?',    jp: 'これはアルコールが入っていますか？',            romaji: 'Kore wa arukooru ga haitte imasu ka? (koh-reh wah ah-roo-koh-roo gah hai-teh ee-mas-ka)' },
      { en: 'No meat please (fish ok)',      jp: '肉は抜きでお願いします（魚は大丈夫です）',      romaji: 'Niku wa nuki de onegaishimasu (sakana wa daijoubu desu) (nee-koo wah noo-kee deh oh-neh-gai-shee-mas, sa-ka-na wah dai-joh-boo des)' },
      { en: 'No meat or fish please',        jp: '肉と魚は抜きでお願いします',                    romaji: 'Niku to sakana wa nuki de onegaishimasu (nee-koo toh sa-ka-na wah noo-kee deh oh-neh-gai-shee-mas)' },
      { en: 'I have a food allergy',         jp: '食物アレルギーがあります',                      romaji: 'Shokumotsu arerugii ga arimasu (sho-koo-moh-tsoo a-reh-roo-gee gah ah-ree-mas)' },
    ],
  },

  {
    id: 'shopping',
    label: 'Shopping (Tax-Free)',
    icon: '🛍',
    color: '#ec4899',
    iconBg: '#fce7f3',
    items: [
      { en: 'Tax-free please',           jp: '免税でお願いします',                romaji: 'Menzei de onegaishimasu (men-zay deh oh-neh-gai-shee-mas)' },
      { en: 'How much is this?',         jp: 'これはいくらですか？',              romaji: 'Kore wa ikura desu ka? (koh-reh wah ee-koo-rah des-ka)' },
      { en: 'Bigger size please',        jp: 'もっと大きいサイズはありますか？',  romaji: 'Motto ookii saizu wa arimasu ka? (mot-toh oh-kee sai-zoo wah ah-ree-mas-ka)' },
      { en: 'Smaller size please',       jp: 'もっと小さいサイズはありますか？',  romaji: 'Motto chiisai saizu wa arimasu ka? (mot-toh chee-sai sai-zoo wah ah-ree-mas-ka)' },
      { en: 'Another color?',            jp: '別の色はありますか？',              romaji: 'Betsu no iro wa arimasu ka? (bet-soo no ee-roh wah ah-ree-mas-ka)' },
      { en: 'Can I try this on?',        jp: '試着できますか？',                  romaji: 'Shichaku dekimasu ka? (shee-cha-koo deh-kee-mas-ka)' },
      { en: 'Too expensive',             jp: '高すぎます',                        romaji: 'Takasugimasu (ta-ka-soo-gee-mas)' },
      { en: "I'll take this",            jp: 'これにします',                      romaji: 'Kore ni shimasu (koh-reh nee shee-mas)' },
      { en: 'Gift wrap please',          jp: 'ギフト包装お願いします',            romaji: 'Gifuto housou onegaishimasu (gee-foo-toh hoh-soh oh-neh-gai-shee-mas)' },
    ],
  },

  {
    id: 'transport',
    label: 'Train & Transport',
    icon: '🚆',
    color: '#6366f1',
    iconBg: '#e0e7ff',
    items: [
      { en: 'Where is this station?',     jp: 'この駅はどこですか？',              romaji: 'Kono eki wa doko desu ka? (ko-no eh-kee wah do-koh des-ka)' },
      { en: 'Which platform?',            jp: '何番線ですか？',                    romaji: 'Nanbansen desu ka? (nan-ban-sen des-ka)' },
      { en: 'How much is the fare?',      jp: '運賃はいくらですか？',              romaji: 'Unchin wa ikura desu ka? (oon-chin wah ee-koo-rah des-ka)' },
      { en: 'Does this train stop here?', jp: 'この電車はここに停まりますか？',    romaji: 'Kono densha wa koko ni tomarimasu ka? (ko-no den-sha wah ko-ko nee toh-ma-ree-mas-ka)' },
      { en: 'Suica top-up please',        jp: 'スイカにチャージお願いします',      romaji: 'Suika ni chaaji onegaishimasu (swee-ka nee chah-jee oh-neh-gai-shee-mas)' },
      { en: 'Where is the taxi stand?',   jp: 'タクシー乗り場はどこですか？',      romaji: 'Takushii noriba wa doko desu ka? (tak-shee no-ree-bah wah do-koh des-ka)' },
      { en: 'Please take me to this address', jp: 'この住所までお願いします',      romaji: 'Kono juusho made onegaishimasu (ko-no joo-sho ma-deh oh-neh-gai-shee-mas)' },
    ],
  },

  {
    id: 'emergency',
    label: 'Help / Emergency',
    icon: '🆘',
    color: '#dc2626',
    iconBg: '#fee2e2',
    items: [
      { en: 'Help!',                       jp: '助けて！',                          romaji: 'Tasukete! (tas-keh-teh)' },
      { en: "I'm lost",                    jp: '道に迷いました',                    romaji: 'Michi ni mayoimashita (mee-chee nee ma-yoy-mash-ta)' },
      { en: 'Where is the toilet?',        jp: 'トイレはどこですか？',              romaji: 'Toire wa doko desu ka? (toy-reh wah do-koh des-ka)' },
      { en: 'Where is the hospital?',      jp: '病院はどこですか？',                romaji: 'Byouin wa doko desu ka? (byoh-een wah do-koh des-ka)' },
      { en: 'Where is the pharmacy?',      jp: '薬局はどこですか？',                romaji: 'Yakkyoku wa doko desu ka? (yak-kyo-koo wah do-koh des-ka)' },
      { en: 'I feel sick',                 jp: '気分が悪いです',                    romaji: 'Kibun ga warui desu (kee-boon gah wa-roo-ee des)' },
      { en: 'Call an ambulance!',          jp: '救急車を呼んでください',            romaji: 'Kyuukyuusha o yonde kudasai (kyoo-kyoo-sha oh yon-deh koo-da-sai)' },
      { en: 'Call the police',             jp: '警察を呼んでください',              romaji: 'Keisatsu o yonde kudasai (kay-sa-tsoo oh yon-deh koo-da-sai)' },
      { en: 'I lost my passport',          jp: 'パスポートをなくしました',          romaji: 'Pasupooto o nakushimashita (pas-poh-toh oh na-koo-shee-mash-ta)' },
      { en: 'I lost my wallet',            jp: '財布をなくしました',                romaji: 'Saifu o nakushimashita (sai-foo oh na-koo-shee-mash-ta)' },
    ],
  },
];

export default PHRASE_GROUPS;
