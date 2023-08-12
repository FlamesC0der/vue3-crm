<template>
   <table>
      <thead>
         <tr>
            <th>#</th>
            <th>{{$filters.localizeFilter('Sum')}}</th>
            <th>{{$filters.localizeFilter('Date')}}</th>
            <th>{{$filters.localizeFilter('HistoryTable_Category')}}</th>
            <th>{{$filters.localizeFilter('HistoryTable_Type')}}</th>
            <th>{{$filters.localizeFilter('HistoryTable_Open')}}</th>
         </tr>
      </thead>

      <tbody>
         <tr v-for="(record, idx) of records" :key="record.id">
            <td>{{idx + 1}}</td>
            <td>{{$filters.currencyFilter(record.amount, 'RUB')}}</td>
            <td>{{$filters.dateFilter(record.date, 'datetime') }}</td>
            <td>{{record.categoryName }}</td>
            <td>
               <span 
                     :class="[record.typeClass]"
                     class="white-text badge"
                  >{{ record.typeText }}</span>
            </td>
            <td>
               <button 
                  v-tooltip="$filters.localizeFilter('HistoryTable_openRecord')"
                  class="btn-small btn" 
                  @click="$router.push(`/detail/${record.id}`)"
               >
                  <i class="material-icons">open_in_new</i>
               </button>
            </td>
         </tr>
      </tbody>
   </table>
</template>

<script>
export default {
   props: {
      records: {
         required: true,
         type: Array
      }
   }
}
</script>
