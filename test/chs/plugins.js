/* global describe, it, before, after */

import should from 'should/as-function';
import _ from 'lodash';
import helpers from './helpers';

describe('plugin 插件', () => {
  before(helpers.before('plugins'));

  describe('计算面积', async () => {
    it('不知道形状', async () => {
      should(await helpers.replyString('user1', '计算面积'))
        .eql('好的，什么形状？');
    });

    it('正方形', async () => {
      should(await helpers.replyString('user1', '正方形'))
        .eql('边长是多少？');

      should(await helpers.replyString('user1', '5.5'))
        .eql('正方形的面积是 30.25');
    });

    it('知道形状', async () => {
      should(await helpers.replyString('user1', '计算面积'))
        .eql('边长是多少？');

      should(await helpers.replyString('user1', '6'))
        .eql('正方形的面积是 36');
    });

    it('圆形', async () => {
      should(await helpers.replyString('user1', '圆形'))
        .eql('半径是多少？');

      should(await helpers.replyString('user1', '1'))
        .eql('圆形的面积是 3.141592653589793');
    });

    it('长方形', async () => {
      should(await helpers.replyString('user1', '长方形'))
        .eql('长和宽是多少？');

      should(await helpers.replyString('user1', '2 3'))
        .eql('长方形的面积是 6');

      should(await helpers.replyString('user1', '计算面积'))
        .eql('长和宽是多少？');

      should(await helpers.replyString('user1', '3.2, 5.8'))
        .eql('长方形的面积是 18.56');
    });
  });

  after(helpers.after);
});

