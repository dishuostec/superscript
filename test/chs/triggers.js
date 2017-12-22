/* global describe, it, before, after */

import should from 'should/as-function';
import helpers from './helpers';

describe('Trigger 触发器', () => {
  before(helpers.before('trigger'));

  it('支持中文', async () => {
    should(await helpers.replyString('user1', '中文'))
      .eql('support chinese');
  });

  describe('支持通配符', () => {
    it('支持通配符', async () => {
      should(await helpers.replyString('user1', '通配符'))
        .eql('support wildcards');

      should(await helpers.replyString('user1', '测试通配符'))
        .eql('support wildcards');
      should(await helpers.replyString('user1', '测试一下通配符'))
        .eql('support wildcards');

      should(await helpers.replyString('user1', '通配符测试'))
        .eql('support wildcards');
      should(await helpers.replyString('user1', '通配符测试一下'))
        .eql('support wildcards');

      should(await helpers.replyString('user1', '测试一下通配符支持程度'))
        .eql('support wildcards');
    });

    it('指定长度', async () => {
      should(await helpers.replyString('user1', '指定长度2测试一下'))
        .eql('wildcards support extract length 2');

      should(await helpers.replyString('user1', '指定长度2测试'))
        .eql('');

      should(await helpers.replyString('user1', '指定长度2测试一下啦'))
        .eql('');
    });

    it('最大长度', async () => {
      should(await helpers.replyString('user1', '最大匹配2'))
        .eql('max 2 wildcards');

      should(await helpers.replyString('user1', '最大匹配2测试'))
        .eql('max 2 wildcards');

      should(await helpers.replyString('user1', '最大匹配2测试一下'))
        .eql('max 2 wildcards');

      should(await helpers.replyString('user1', '最大匹配2测试一下啦'))
        .eql('');
    });

    it('范围长度', async () => {
      should(await helpers.replyString('user1', '范围匹配测试'))
        .eql('');

      should(await helpers.replyString('user1', '范围匹配测试一下'))
        .eql('min-max wildcards');

      should(await helpers.replyString('user1', '范围匹配测试一下测试'))
        .eql('min-max wildcards');

      should(await helpers.replyString('user1', '范围匹配测试一下测试一下'))
        .eql('min-max wildcards');

      should(await helpers.replyString('user1', '范围匹配测试一下测试一下啦'))
        .eql('');
    });
  });

  it('替换词', async () => {
    should(await helpers.replyString('user1', '替换词太阳'))
      .eql('alternates');

    should(await helpers.replyString('user1', '替换词月亮'))
      .eql('alternates');

    should(await helpers.replyString('user1', '替换词星星'))
      .eql('alternates');

    should(await helpers.replyString('user1', '替换词大海'))
      .eql('');
  });

  it('可选词', async () => {
    should(await helpers.replyString('user1', '支持可选词'))
      .eql('optionals');

    should(await helpers.replyString('user1', '支持使用可选词'))
      .eql('optionals');

    should(await helpers.replyString('user1', '支持可选词匹配语句'))
      .eql('optionals');

    should(await helpers.replyString('user1', '支持使用可选词匹配语句'))
      .eql('optionals');

    should(await helpers.replyString('user1', '支持使用可选词匹配'))
      .eql('');

    should(await helpers.replyString('user1', '支持用可选词'))
      .eql('');
  });

  it('指定词性', async () => {
    should(await helpers.replyString('user1', '太阳比地球大'))
      .eql('太阳 地球 大');

    should(await helpers.replyString('user1', '非常比地球大'))
      .eql('');
  });

  it('问题', async () => {
    should(await helpers.replyString('user1', '问题？'))
      .eql('question');

    should(await helpers.replyString('user1', '问题是什么'))
      .eql('question');

    should(await helpers.replyString('user1', '这是问题答案吗'))
      .eql('question');

    should(await helpers.replyString('user1', '这是问题答案'))
      .eql('');
  });


  after(helpers.after);
});

