<template>
  <div class="book">
    <table>
      <caption>{{ stock }}</caption>
      <thead>
        <th>Bid</th>
        <th>Price</th>
        <th>Ask</th>
      </thead>
      <tbody>
        <tr
          v-for="price in prices.s"
          :key="price"
        >
          <td></td>
          <td>{{ priceFormatter(price) }}</td>
          <td>{{ renderData.s[price] }}</td>
        </tr>
        <tr
          v-for="price in prices.b"
          :key="price"
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
        b: Object.keys(this.renderData.b).sort((a, b) => +b - +a),
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
