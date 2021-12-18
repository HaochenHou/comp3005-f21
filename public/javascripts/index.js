function search() {
  let searchValue = $('#searchValue').val();
  window.location.href = `/books/search?value=${searchValue}`;
}

function login() {
  let data = {};
  $('#form').serializeArray().forEach(item => {
    data[item.name] = item.value;
  });
  $.ajax({
    url: '/api/login',
    method: 'POST',
    data: data,
    success: function(res) {
      if (res.data.role === 'ADMIN') {
        window.location.replace('/books/management');
      } else {
        window.location.replace('/');
      }  
    },
    error: function({ responseJSON }) {
      window.alert(responseJSON.msg);
    }
  });
}

function register() {
  let data = {};
  $('#form').serializeArray().forEach(item => {
    data[item.name] = item.value;
  });
  $.ajax({
    url: '/api/register',
    method: 'POST',
    data: data,
    success: (res) => {
      window.location.replace('/');
    },
    error: ({ responseJSON }) => {
      window.alert(responseJSON.msg);
    }
  });
}

function submitOrder() {
  console.log($('[name="basketId"]').serializeArray())
  let basketIds = $('[name="basketId"]').serializeArray().map(item => parseInt(item.value));
  $.ajax({
    url: '/api/order',
    method: 'POST',
    data: {
      basketIds: basketIds.join(',')
    },
    success: function(res) {
      window.alert(res.msg);
    }
  })
}