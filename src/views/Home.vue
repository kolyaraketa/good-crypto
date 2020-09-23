<template>
  <div class="home">
    <label>
      Interval in seconds
      <input
        v-model.number="intervalDuration"
        pattern="\d+"
        type="number"
        @input="validateIntervalDuration"
      />
    </label>
    <book
      v-if="books.SPY"
      :data="books.SPY"
      stock="SPY"
    />
  </div>
</template>

<script>
import Book from '@/components/Book.vue';

import EQL from '@/json/EQL';
import SPY from '@/json/SPY';

const STOCK_DATA = { SPY, EQL };
const MAX_INTERVAL = 60;
const MIN_INTERVAL = 1;
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
      intervalDuration: 1 // Seconds
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

    validateIntervalDuration() {
      if (this.intervalDuration > MAX_INTERVAL) {
        this.intervalDuration = MAX_INTERVAL;
      } else if (this.intervalDuration < MIN_INTERVAL) {
        this.intervalDuration = MIN_INTERVAL;
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
