# Inline Editing for collection of elements

in your application.js

    $("table.admin#books).inlines() 

the html

    <table.admin#books>
      <tr data-inline="/books/1-Ada">
        <td.title>Ada<td>
        <td.author>Nabokov</td>
      </tr>
      <tr data-inline="/books/2-Pnine">
        <td.title>Pnine<td>
        <td.author>Nabokov</td>
      </tr>
    </table>

