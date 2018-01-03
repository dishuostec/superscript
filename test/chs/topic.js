/* global describe, it, before, after */

import should from 'should/as-function';
import _ from 'lodash';
import helpers from './helpers';

describe('Topics 话题', () => {
  before(helpers.before('topics'));

  it('切换换题', async () => {
    should(await helpers.replyString('user1', '你喜欢什么'))
      .eql('红色');
    should(await helpers.replyString('user1', '你讨厌什么'))
      .eql('黑色');

    should(await helpers.replyString('user1', '问动物'))
      .eql('好的，开始回答动物');

    should(await helpers.replyString('user1', '你喜欢什么'))
      .eql('河马');
    should(await helpers.replyString('user1', '你讨厌什么'))
      .eql('老鼠');
  });

  describe('保留话题', () => {
    it('开始话题', async () => {
      should(await helpers.replyString('user2', '你喜欢什么'))
        .eql('红色');
    });

    it('自动切换到植物话题', async () => {
      should(await helpers.replyString('user2', '你喜欢什么'))
        .eql('松树');
    });

    it('用keep保留话题', async () => {
      should(await helpers.replyString('user2', '你喜欢什么'))
        .eql('松树');
      should(await helpers.replyString('user2', '你喜欢什么'))
        .eql('松树');
    });

    it('切换到动物', async () => {
      should(await helpers.replyString('user2', '问动物'))
        .eql('好的，开始回答动物');

      should(await helpers.replyString('user2', '你喜欢什么'))
        .eql('河马');
    });

    it('自动切换到植物话题', async () => {
      should(await helpers.replyString('user2', '你喜欢什么'))
        .eql('松树');
    });
  });

  describe('默认只查找最近的10条回复', () => {
    it('开始话题', async () => {
      should(await helpers.replyString('user3', '你喜欢什么'))
        .eql('红色');
      should(await helpers.replyString('user3', '你讨厌什么'))
        .eql('黑色');
    });

    it('自动切换到植物话题', async () => {
      should(await helpers.replyString('user3', '你喜欢什么'))
        .eql('松树');
      should(await helpers.replyString('user3', '你讨厌什么'))
        .eql('丁香');
    });

    it('用keep保留话题', async () => {
      should(await helpers.replyString('user3', '你喜欢什么'))
        .eql('松树');
      should(await helpers.replyString('user3', '你讨厌什么'))
        .eql('丁香');
      should(await helpers.replyString('user3', '你喜欢什么'))
        .eql('松树');
      should(await helpers.replyString('user3', '你讨厌什么'))
        .eql('丁香');
    });

    it('切换到动物', async () => {
      should(await helpers.replyString('user3', '问动物'))
        .eql('好的，开始回答动物');

      should(await helpers.replyString('user3', '你喜欢什么'))
        .eql('河马');
      should(await helpers.replyString('user3', '你讨厌什么'))
        .eql('老鼠');
    });

    it('“红色”已超出10条的历史范围，切换到颜色话题', async () => {
      should(await helpers.replyString('user3', '你喜欢什么'))
        .eql('红色');
      should(await helpers.replyString('user3', '你讨厌什么'))
        .eql('黑色');
    });
  });


  after(helpers.after);
});

