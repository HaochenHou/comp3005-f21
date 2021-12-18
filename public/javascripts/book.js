function addBook() {
  let requireFields = ['name', 'author', 'ISBN', 'genre', 'price', 'pages'];
  let formData = $('#form').serializeArray();
  let params = {};

  for (let i = 0; i < formData.length; i++) {
    let item = formData[i];
    let value = item.value.trim();
    if (requireFields.includes(item.name) && value === '') {
      window.alert(`${item.name} is required.`);
      return;
    }
    params[item.name] = item.value;
  }

  console.log(params);
  $.ajax({
    url: '/api/books',
    method: 'POST',
    data: params,
    success: function(res) {
      window.alert(res.msg);
      $('#form').trigger('reset');
      // window.location.replace('/books/management');
    }
  });
}

function deleteBook(id) {
  let r = window.confirm('Are you sure to delete this book?');
  if (r) {
    $.ajax({
      url: `/api/books/${id}`,
      method: 'DELETE',
      success: function(res) {
        window.location.reload();
      }
    });
  } 
}

function addToBasket() {
  let bookId = $('#bookId').val();
  $.ajax({
    url: '/api/baskets',
    method: 'POST',
    data: {
      bookId: bookId
    },
    success: function(res) {
      window.alert('Add Success!');
    },
    error: function(res) {
      console.log(res)
      if (res.status === 401) {
        window.alert('Please login first.');
      }
    }
  });
}