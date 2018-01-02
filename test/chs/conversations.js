/* global describe, it, before, after */

import should from 'should/as-function';
import _ from 'lodash';
import helpers from './helpers';

describe('Conversations 对话', () => {
  before(helpers.before('conversations'));

  it('简单对话', async () => {
    should(await helpers.replyString('user1', '问我颜色'))
      .eql('你喜欢什么颜色？');

    should(await helpers.replyString('user1', '红色'))
      .eql('红色也是我喜欢的颜色');
  });

  it('复杂对话', async () => {
    should(await helpers.replyString('user2', '测试询问姓氏'))
      .eql('您贵姓？');

    should(await helpers.replyString('user2', '王'))
      .eql('您姓“王”，对吗？');

    should(await helpers.replyString('user2', '对'))
      .eql('好的');
  });

  it('复杂对话2', async () => {
    should(await helpers.replyString('user3', '测试询问姓氏'))
      .eql('您贵姓？');

    should(await helpers.replyString('user3', '啊？'))
      .eql('您姓“啊”，对吗？');

    should(await helpers.replyString('user3', '不对'))
      .eql('请您再输入一次 您贵姓？');

    should(await helpers.replyString('user3', '张'))
      .eql('您姓“张”，对吗？');

    should(await helpers.replyString('user3', '对'))
      .eql('好的');
  });

  after(helpers.after);
});

