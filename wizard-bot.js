const { Telegraf, Scenes, session } = require("telegraf");
const fetch = require("node-fetch");

const stage = new Scenes.Stage([]);

const bot = new Telegraf("<TG_TOKEN>");

bot.use(session());
bot.use(stage.middleware());

bot.telegram.setMyCommands([
    {
        command: "start",
        description: "Стартуем бота - ничего лишнего",
    },
    {
        command: "end",
        description: "Завершить тест – Внимание! стирает все сохранения",
    },
]);

bot.start(async (ctx) => {
    ctx.session.cnt = 0;
    ctx.session.result = -1;
    const e = await saveUserData(ctx);
    return ctx.reply(
        `Приветствую, ${
            ctx.from.first_name ? ctx.from.first_name : "хороший человек"
        }!\n\nTEST1`
    );
});

bot.command("whoami", async (ctx) => {
    const {id, username, first_name, last_name} = ctx.from;
    return ctx.replyWithMarkdown(
        `Кто ты в телеграмме:
        *id* : ${id}
        *username* : ${username}
        *Имя* : ${first_name}
        *Фамилия* : ${last_name}
        *chatId* : ${ctx.chat.id}`);
});

// bot.on("text", async (ctx) => {
//     const res = await getUserResult(ctx);
//     ctx.session.cnt = res.step;
//     ctx.session.result = res.result;
//
//     if (ctx.session.cnt == "undefined") {
//         ctx.session.cnt = -1;
//         ctx.session.result = -1;
//         const e = await saveUserData(ctx);
//         return ctx.reply("ОШИБКА!!");
//     } else if (ctx.session.cnt == -1) {
//         ctx.session.result = -1;
//         const e = await saveUserData(ctx);
//     } else if (ctx.session.cnt == 0) {
//         let message = "Отлично, начинаем!\n\n" +
//             "Задача 1 из 10\n" +
//             "\n" +
//             "При сложении нескольких чисел джун допустил следующие ошибки: \n" +
//             "цифру единиц `2` он принял за `9` и цифру десятков `4` принял за `7`. В сумме получилось 750. \n" +
//             "Рассчитай верную сумму."
//         let step = subjectStep(ctx, "start", "Неверно -- напиши `start`", message, false);
//         const e = await saveUserData(ctx);
//         return step;
//     } else if (ctx.session.cnt == 1) {
//         let message = "Задача 2 из 10\n" +
//           "\n" +
//           "Разработчик Вася решил сменить работу, потому что его не устраивала зарплата. На собеседовании Вася запросил 185 000 рублей, что на 25% больше текущей зарплаты. \n" +
//           "Сколько Вася получает сейчас?"
//         let step = subjectStep(ctx, "713", "Неверно", message, true);
//         const e = await saveUserData(ctx);
//         return step;
//     } else if (ctx.session.cnt == 2) {
//         let message = "Задача 3 из 10\n" +
//            "\n" +
//            "Записать число 16 с помощью четырех пятерок (5), используя арифметические знаки (+,-,*,/).\n" +
//            "Введи ответ без пробелов, например: 777-77*7+7/777"
//         let step = subjectStep(ctx, "148000", "Неверно", message, true);
//         const e = await saveUserData(ctx);
//         return step;
//     } else if (ctx.session.cnt == 3) {
//         let message = "Задача 4 из 10\n" +
//            "\n" +
//            "В спринт попало 17 задач. Миша выполнил в 2 раза больше, чем Маша, а Петя больше Маши, но меньше Миши. \n" +
//            "Сколько задач выполнил Петя?"
//         let step = subjectStep(ctx, "55/5+5", "Неверно", message, true);
//         const e = await saveUserData(ctx);
//         return step;
//     } else if (ctx.session.cnt == 4) {
//         let message = "Задача 5 из 10\n" +
//           "\n" +
//           "Подрядчик на аутсорсе оценил верстку девяти одинаковых таблиц на сайте меньше чем в 1000 человеко-часов, а верстку десяти абсолютно таких же таблиц более чем в 1100 человеко-часов.  Есть инсайдерская информация, что верстка одной таблицы занимает целое количество часов. \n" +
//           "Во сколько часов подрядчик оценил верстку одной такой таблицы? В ответе введи только число."
//         let step = subjectStep(ctx, "5", "Неверно", message, true);
//         const e = await saveUserData(ctx);
//         return step;
//     } else if (ctx.session.cnt == 5) {
//         let message = "Задача 6 из 10\n" +
//           "\n" +
//           "Полтора рекрутера за полтора месяца находят полтора синиора. Сколько синиоров найдут 9 рекрутеров за 9 месяцев?\n" +
//           "В ответе введи только число."
//         let step = subjectStep(ctx, "111", "Неверно", message, true);
//         const e = await saveUserData(ctx);
//         return step;
//     } else if (ctx.session.cnt == 6) {
//         let message = "Задача 7 из 10\n" +
//           "\n" +
//           "Разработчик начал работать в компании на аутсорсе. Он хотел получать 1 000 рублей в час, но руководитель сомневался в компетенциях и предложил такую схему:\n" +
//           "- За каждую задачу, которая выполнена в срок, ему платят 1 000 рублей;\n" +
//           "- за каждую просроченную задачу из его заработка вычитают 1 500 рублей;\n" +
//           "- выплата рассчитывается за каждые 30 задач.\n" +
//           "\n" +
//           "Разработчик выполнил 30 задач и попросил рассчитаться. Ему сказали, что ему ничего не должны — вся сумма ушла на штрафы. \n" +
//           "Сколько задач разработчик просрочил? В ответе введи только число."
//         let step = subjectStep(ctx, "54", "Неверно", message, true);
//         const e = await saveUserData(ctx);
//         return step;
//     } else if (ctx.session.cnt == 7) {
//         let message = "Задача 8 из 10\n" +
//             "\n" +
//             "Карл и Клара работают в большой компании в одном бизнес-центре. Клара работает на 12 этажей выше. Однажды Карл решил подняться к Кларе для обсуждения задачи. Пройдя половину пути, он оказался на 8 этаже. \n" +
//             "На каком этаже работает Клара?"
//         let step = subjectStep(ctx, "12", "Неверно", message, true);
//         const e = await saveUserData(ctx);
//         return step;
//     } else if (ctx.session.cnt == 8) {
//         let message = "Задача 9 из 10\n" +
//             "\n" +
//             "У Бибы и Бобы в спринте стоят задачи. Каждая из них оценена в 1, 3, 5 или 7 часов. Суммарная оценка задач в спринте у Бибы и Бобы одинаковая. При этом у Бибы 1-часовых задач столько же, сколько у Бобы 3-часовых, 3-часовых — столько же, сколько у Бобы 5-часовых, 5-часовых — столько же, сколько у Бобы 7-часовых, а 7-часовых — столько же, сколько у Бобы 1-часовых.\n" +
//             "Определи сколько у Бибы 7-часовых задач, если известно, что у каждого по 20 задач в спринте."
//         let step = subjectStep(ctx, "14", "Неверно", message, true);
//         const e = await saveUserData(ctx);
//         return step;
//     } else if (ctx.session.cnt == 9) {
//         let message = "Задача 10 из 10\n" +
//             "\n" +
//             "Четыре разработчика решают задачи вместе: один пишет код, а остальные три хором диктуют. Оказалось, что Раджеш диктовал код меньше всех остальных — в пяти задачах. А Махатма диктовал больше всех — в восьми задачах. \n" +
//             "Сколько всего задач решили разработчики? В ответе введи только число."
//         let step = subjectStep(ctx, "5", "Неверно", message, true);
//         const e = await saveUserData(ctx);
//         return step;
//     } else if (ctx.session.cnt == 10) {
//         const tmpResult = ctx.session.result;
//         let error = "";
//         let step = subjectStep(ctx, "9", error, ``, true);
//         if (ctx.session.result == tmpResult) {
//             error = "Неверно\n\n";
//         }
//         const e = await saveUserData(ctx);
//         let message = `Спасибо за прохождение! Результат: ` + ctx.session.result + ` баллов.`;
//         if (ctx.session.result >= 10) {
//             message += `\n\nПотрясающе 🥳️🥳️🥳️🥳️🥳️🥳️🥳️🥳️`;
//         } else if (ctx.session.result >= 7) {
//             message += `\n\nХороший результат!`;
//         } else if (ctx.session.result < 7) {
//             message += `\n\nВ следующий раз обязтельно получится!`;
//         }
//
//         return ctx.reply(error + message);
//     }
// });

bot.launch();
// const router = new Router();
// router.post(`/sj-talent-tg`, createTelegrafMiddleware(bot));
// new Application().use(router.middleware).listen();
