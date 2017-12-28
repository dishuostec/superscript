/* global describe, it, before, after */

import should from 'should/as-function';
import _ from 'lodash';
import helpers from './helpers';

describe('Replies 回复', () => {
  before(helpers.before('replies'));

  it('重复回答', async () => {
    const expect = [
      '回答1',
      '回答2',
    ];
    const replies = [];

    for (let i = 0; i < 10; i++) {
      const reply = await helpers.replyString('user1', '测试回答');
      should(expect).containEql(reply);
      replies.push(reply);
    }

    const count = _.countBy(replies);

    should(count['回答1']).above(1);
    should(count['回答2']).above(1);
  });

  it('标记丢弃', async () => {
    const expect = [
      '只回答一次',
      '其他回答这个',
    ];
    const replies = [];

    for (let i = 0; i < 10; i++) {
      const reply = await helpers.replyString('user1', '一次性回答');
      should(expect).containEql(reply);
      replies.push(reply);
    }

    const count = _.countBy(replies);

    should(count['只回答一次']).eql(1);
  });

  it('捕获', async () => {
    should(await helpers.replyString('user1', '我叫张三'))
      .eql('你好张三!');

    should(await helpers.replyString('user1', '测试捕获中文文本'))
      .eql('结果是“测试”和“中文文本”');

    should(await helpers.replyString('user1', '刚才结果是什么'))
      .eql('刚才结果是“测试”和“中文文本”');
  });

  it('重定向', async () => {
    should(await helpers.replyString('user1', '测试重定向'))
      .eql('可以得到重定向回答');
  });

  it('子回答', async () => {
    const reply = await helpers.reply('user1', '测试延迟');
    should(reply.subReplies)
      .eql([
        { delay: '0', string: '第一句' },
        { delay: '0', string: '第二句' },
        { delay: '0', string: '第三句' },
      ]);
  });

  after(helpers.after);
});

