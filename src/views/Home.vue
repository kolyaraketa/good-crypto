<template>
  <div class="home">
    <label>
      Interval in seconds
      <input
        v-model.number="intervalDuration"
        pattern="\d+"
        type="number"
        @input="inputIntervalDuration"
      />
    </label>
    <label>
      Max Depth
      <input
        v-model.number="depth"
        pattern="\d+"
        type="number"
        @input="validateDepth"
      />
    </label>
    <div
      v-if="Object.keys(books).length"
      class="home__books"
    >
      <div
        v-for="(data, stock) in books"
        :key="stock"
        class="home__book"
      >
        <book
          :data="data"
          :stock="stock"
          :depth="depth"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Book from '@/components/Book.vue';

import EQL from '@/json/EQL';
import SPY from '@/json/SPY';

const STOCK_DATA = { SPY, EQL };
const MAX_INTERVAL = 60;
const MIN_INTERVAL = 1;
const MAX_DEPTH = 99;
const MIN_DEPTH = 1;
const MSG_TYPES = {
  ADD: 'addMessage',
  DELETE: 'deleteMessage',
  CANCEL: 'cancelMessage',
  EXECUTED: 'executedMessage',
  EXECUTED_WITH_PRICE: 'executedMessage',
  REPLACE: 'replaceMessage'
};

export default {
  name: 'Home',
  components: { Book },
  data() {
    return {
      books: {},
      interval: null,
      intervalPosition: 0,
      intervalDuration: 1, // Seconds
      depth: 10
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      Object.keys(STOCK_DATA).forEach((type) => {
        this.$set(this.books, type, []);
      }, {});
      this.setUpdateInterval();
    },

    setUpdateInterval() {
      this.interval = setInterval(() => {
        if (SPY.length > this.intervalPosition) {
          this.intervalPosition++;
        } else {
          return clearInterval(this.interval);
        }
        Object.keys(STOCK_DATA).forEach((stock) => {
          this.messageController(STOCK_DATA[stock][this.intervalPosition], stock);
        });
      }, this.intervalDuration * 1000);
    },

    inputIntervalDuration() {
      clearInterval(this.interval);
      this.validateIntervalDuration();
      this.setUpdateInterval();
    },

    validateIntervalDuration() {
      if (this.intervalDuration > MAX_INTERVAL) {
        this.intervalDuration = MAX_INTERVAL;
      } else if (this.intervalDuration < MIN_INTERVAL) {
        this.intervalDuration = MIN_INTERVAL;
      }
    },

    validateDepth() {
      if (this.depth > MAX_DEPTH) {
        this.depth = MAX_DEPTH;
      } else if (this.depth < MIN_DEPTH) {
        this.depth = MIN_DEPTH;
      }
    },

    getMsgIndexByOrderId(orderId, stock) {
      return this.books[stock].findIndex((m) => m.OrderID === orderId);
    },

    getMsgByOrderId(orderId, stock) {
      return this.books[stock].find((m) => m.OrderID === orderId);
    },

    messageController(msg, stock) {
      try {
        return this[MSG_TYPES[msg.Type]](msg, stock);
      } catch (error) {
        console.error(`MessageControllerError: ${msg.Type}`, error);
      }
    },

    addMessage(msg) {
      return this.books[msg.Stock].push(msg);
    },

    deleteMessage(msg, stock) {
      const msgIndex = this.getMsgIndexByOrderId(msg.orderId, stock);
      if (msgIndex === -1) return;
      return this.books[stock].splice(msgIndex, 1);
    },

    cancelMessage(msg, stock) {
      const targetMsg = this.getMsgByOrderId(msg.orderId, stock);
      if (!targetMsg) return;
      // If no more shares - delete msg
      if (+targetMsg.shares === +msg.CanceledShares) this.deleteMessage(msg, stock);
      targetMsg.Shares = +targetMsg.shares - +msg.CanceledShares;
    },

    executedMessage(msg, stock) {
      const targetMsg = this.getMsgByOrderId(msg.orderId, stock);
      if (!targetMsg) return;
      // If no more shares - delete msg
      if (+targetMsg.shares === +msg.ExecutedShares) this.deleteMessage(msg, stock);
      targetMsg.Shares = +targetMsg.shares - +msg.CanceledShares;
    },

    replaceMessage(msg, stock) {
      const targetMsg = this.getMsgByOrderId(msg.OriginalOrderID, stock);
      if (!targetMsg) return;
      targetMsg.OrderID = msg.NewOrderID;
      targetMsg.Shares = msg.Shares;
      targetMsg.Price = msg.Price;
    }
  }
};
</script>

<style lang="sass" scoped>
.home__books
  display: flex
  justify-content: center
  align-items: flex-start
  padding-top: 30px
.home__book
  margin: 0 50px
</style>
