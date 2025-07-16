<%- include('../partials/header', { title: 'Добавление нового блока' }) %>

<div class="container mt-4">
  <h1>Добавление блока в курс: <%= course.title %></h1>
  
  <form action="/courses/<%= course._id %>/modules" method="POST">
    <div class="mb-3">
      <label class="form-label">Название блока</label>
      <input type="text" name="title" class="form-control" required>
    </div>
    
    <div class="mb-3">
      <label class="form-label">Порядковый номер</label>
      <input type="number" name="order" class="form-control" min="0" value="0">
    </div>
    
    <button type="submit" class="btn btn-primary">Создать блок</button>
    <a href="/courses/<%= course._id %>" class="btn btn-outline-secondary ms-2">
      Отмена
    </a>
  </form>
</div>

<%- include('../partials/footer') %>
