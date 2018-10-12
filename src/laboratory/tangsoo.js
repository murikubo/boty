

module.exports = (message) => {
    const tangRepeat = (message) => {
        message.channel.send('탕')
            .then(() => {
                const filter = m => m.author.id === message.author.id;
                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 1200,
                    errors: ['time'],
                })
                    .then((collected) => {
                        let answer = collected.first().content;
                        if(answer != '수') {message.channel.send('틀렸습니다!'); return;}
                        else {
                            message.channel.send('육')
                                .then(() => {
                                    const filter = m => m.author.id === message.author.id;
                                    message.channel.awaitMessages(filter, {
                                        max: 1,
                                        time: 1200,
                                        errors: ['time'],
                                    })
                                        .then((collected) => {
                                            let answer = collected.first().content;
                                            if(answer != '탕') {message.channel.send('틀렸습니다!'); return;}
                                            else {
                                                message.channel.send('수')
                                                    .then(() => {
                                                        const filter = m => m.author.id === message.author.id;
                                                        message.channel.awaitMessages(filter, {
                                                            max: 1,
                                                            time: 1200,
                                                            errors: ['time'],
                                                        })
                                                            .then((collected) => {
                                                                let answer = collected.first().content;
                                                                if(answer != '육') {message.channel.send('틀렸습니다!'); return;}
                                                                else {
                                                                    tangRepeat(message);
                                                                }
                                                            }, () => {
                                                                message.channel.send('제한시간 종료!');
                                                            });
                                                    }, () => {
                                                        message.channel.send('제한시간 종료!');
                                                    });
                                            }
                                        }, () => {
                                            message.channel.send('제한시간 종료!');
                                        });
                                }, () => {
                                    message.channel.send('제한시간 종료!');
                                });
                        }
                    }, () => {
                        message.channel.send('제한시간 종료!');
                    })
                    .catch(() => {
                        message.channel.send('제한시간 종료!');
                    });
            });
    };
    tangRepeat(message);
};