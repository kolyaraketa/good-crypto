<template>
  <div class="book">
    <table class="book__table">
      <caption>{{ stock }}</caption>
      <thead>
        <th>Bid</th>
        <th>Price</th>
        <th>Ask</th>
      </thead>
      <tbody>
        <tr
          v-for="price in prices.s.slice(depth * -1)"
          :key="price"
          class="book__table-s"
        >
          <td></td>
          <td>{{ priceFormatter(price) }}</td>
          <td>{{ renderData.s[price] }}</td>
        </tr>
        <tr
          v-for="(price, index) in prices.b.slice(0, depth)"
          :key="index"
          class="book__table-b"
        >
          <td>{{ renderData.b[price] }}</td>
          <td>{{ priceFormatter(price) }}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

export default {
  name: 'Book',
  props: {
    data: {
      type: Array,
      required: true
    },
    stock: {
      type: String,
      required: true
    },
    depth: {
      type: Number,
      required: true
    }
  },
  data() {
    return {};
  },

  computed: {
    renderData() {
      return this.data.reduce(
        (res, el) => {
          if (Object.prototype.hasOwnProperty.call(res[el.Side.toLowerCase()], +el.Price)) {
            res[el.Side.toLowerCase()][+el.Price] += +el.Shares;
          } else {
            res[el.Side.toLowerCase()][+el.Price] = +el.Shares;
          }
          return res;
        },
        { b: {}, s: {} }
      );
    },

    prices() {
      return {
        b: Object.keys(this.renderData.b).sort((a, b) => +a - +b),
        s: Object.keys(this.renderData.s).sort((a, b) => +b - +a)
      };
    }
  },

  created() {
    this.init();
  },

  methods: {
    init() {},

    priceFormatter(price) {
      return priceFormatter.format(price);
    }
  }
};
</script>


<style lang="sass" scoped>
.book__table
  border-collapse: collapse
  th,td
    border: 1px solid #333
    padding: 5px 10px
.book__table-s
  background-color: tomato
.book__table-b
  background-color: lightgreen
</style>
