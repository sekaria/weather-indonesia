<template>
  <div class="container py-5 mx-auto">
    <div class="flex flex-wrap items-center justify-between mb-4">
      <div class="w-full md:w-1/3 mb-4 md:mb-0">
        <label for="provinsi" class="block font-semibold">Pilih Provinsi:</label>
        <select
          v-model="selectedProvinsi"
          @change="onChangeProvinsi"
          class="block w-full border border-gray-300 rounded-md py-2 px-3"
        >
          <option v-for="provinsi in provinsiList" :key="provinsi">{{ provinsi }}</option>
        </select>
      </div>
      <div class="w-full md:w-1/3 mb-4 md:mb-0">
        <label for="kota" class="block font-semibold">Pilih Kota:</label>
        <select
          v-model="selectedKota"
          @change="onChangeKota"
          class="block w-full border border-gray-300 rounded-md py-2 px-3"
        >
          <option v-for="kota in kotaList" :key="kota">{{ kota }}</option>
        </select>
      </div>
      <div class="w-full md:w-auto">
        <button
          @click="searchWeatherData"
          class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          Search
        </button>
      </div>
    </div>

    <div v-if="loading">
      <div class="text-center">
        <div role="status">
          <svg
            aria-hidden="true"
            class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>

    <div v-else>
      <div v-if="error" class="text-red-600 mt-4 text-center text-xl">{{ error }}</div>
      <div v-else>
        <div class="flex flex-wrap items-center justify-center">
          <div class="w-full md:w-1/3 mr-5">
            <!-- Informasi cuaca -->
            <div
              v-if="weatherInfo && Object.keys(weatherInfo).length > 0"
              class="block max-w-sm p-6 bg-tara-apple border-gray-200 rounded-lg shadow hover:bg-off-green"
            >
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-black">
                <span v-if="weatherInfo.description">{{ weatherInfo.description }}, </span>
                <span v-if="weatherInfo.domain">{{ weatherInfo.domain }}</span>
              </h5>
              <div class="font-normal text-gray-500 flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
                <div>
                  <p v-if="weatherInfo.coordinate">{{ weatherInfo.coordinate }}</p>
                </div>
              </div>
            </div>

            <!-- data suhu harian -->
            <div
              v-if="weatherData && Object.keys(weatherInfo).length > 0"
              class="block max-w-sm p-6 bg-tara-apple border-gray-200 rounded-lg shadow hover:bg-off-green mt-3"
            >
              <h5 class="text-2xl font-bold tracking-tight text-black">Temperature Forecast</h5>
              <div class="font-normal text-gray-500">
                <div v-for="(data, index) in weatherData" :key="index">
                  <div v-if="data.description === 'Max temperature'">
                    <div
                      v-for="(time, idx) in data.times"
                      :key="idx"
                      class="mt-4 flex justify-between"
                    >
                      <p>{{ formatDate(time.datetime) }}</p>
                      <p>
                        {{
                          weatherData.find((item) => item.description === 'Max temperature').times[
                            idx
                          ].value
                        }}
                        /
                        {{
                          weatherData.find((item) => item.description === 'Min temperature').times[
                            idx
                          ].value
                        }}
                        {{ time.unit }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="w-full md:w-1/2">
            <!-- data cuaca -->
            <div
              v-if="weatherData && Object.keys(weatherInfo).length > 0"
              class="block max-w-sm p-6 bg-tara-apple border-gray-200 rounded-lg shadow hover:bg-off-green overflow-y-auto h-80"
            >
              <h5 class="text-2xl font-bold tracking-tight text-black">Weather Forecast</h5>
              <div class="font-normal text-gray-500">
                <div v-for="(data, index) in weatherData" :key="index">
                  <div v-if="data.description === 'Temperature'">
                    <div
                      v-for="(time, idx) in mergeTemperatureAndWeather()"
                      :key="idx"
                      class="grid grid-cols-2 divide-x divide-black items-center py-2"
                    >
                      <div class="">
                        <p class="">{{ formatDate(time.datetime) }}</p>
                        <p class="">{{ time.weather }}</p>
                      </div>

                      <div class="">
                        <p class="p-2">{{ time.temperature }}°C</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      error: null,
      provinsiList: ['Jawa Barat', 'Jawa Timur', 'Jawa Tengah'],
      selectedProvinsi: '',
      kotaList: [],
      selectedKota: '',
      weatherInfo: {},
      weatherData: []
    }
  },
  methods: {
    // async onChangeProvinsi() {
    //   this.kotaList = []
    //   if (this.selectedProvinsi === 'Jawa Barat') {
    //     this.kotaList = ['Bandung', 'Kota Bogor', 'Depok', 'Cirebon']
    //   } else if (this.selectedProvinsi === 'Jawa Timur') {
    //     this.kotaList = ['Surabaya', 'Malang', 'Yogyakarta']
    //   }
    // },
    async onChangeProvinsi() {
      this.kotaList = []
      if (this.selectedProvinsi === 'Jawa Barat') {
        this.kotaList = [
          'Bandung',
          'Kota Bogor',
          'Depok',
          'Bekasi',
          'Cimahi',
          'Tasikmalaya',
          'Banjar',
          'Sukabumi',
          'Cirebon',
          'Indramayu',
          'Karawang',
          'Subang',
          'Ciamis',
          'Garut',
          'Pangandaran',
          'Sumedang',
          'Kuningan',
          'Majalengka',
          'Bogor',
          'Sukabumi',
          'Cianjur',
          'Bandung',
          'Garut',
          'Tasikmalaya',
          'Ciamis',
          'Kuningan',
          'Cirebon',
          'Majalengka',
          'Sumedang',
          'Indramayu',
          'Subang',
          'Purwakarta',
          'Karawang',
          'Bekasi',
          'Bandung Barat',
          'Pangandaran'
        ]
      } else if (this.selectedProvinsi === 'Jawa Timur') {
        this.kotaList = [
          'Surabaya',
          'Malang',
          'Kediri',
          'Madiun',
          'Mojokerto',
          'Probolinggo',
          'Pasuruan',
          'Batu',
          'Blitar',
          'Lumajang',
          'Banyuwangi',
          'Jember',
          'Situbondo',
          'Bondowoso',
          'Probolinggo',
          'Pasuruan',
          'Sidoarjo',
          'Lamongan',
          'Gresik',
          'Bangkalan',
          'Mojokerto',
          'Jombang',
          'Nganjuk',
          'Bojonegoro',
          'Tuban',
          'Lamongan',
          'Tulungagung',
          'Trenggalek',
          'Ponorogo',
          'Magetan',
          'Ngawi',
          'Pacitan'
        ]
      }
    },

    async searchWeatherData() {
      if (!this.selectedProvinsi || !this.selectedKota) {
        alert('Silakan pilih provinsi dan kota terlebih dahulu.')
        return
      }
      const formattedProvinsi = this.selectedProvinsi.toLowerCase().replace(/\s+/g, '-')
      const formattedKota = this.selectedKota.toLowerCase().replace(/\s+/g, '-')

      try {
        this.loading = true
        const response = await fetch(
          `http://localhost:3000/weather/${formattedProvinsi}/${formattedKota}`
        )
        const responseData = await response.json()
        if (responseData.success) {
          this.weatherInfo = {
            coordinate: responseData.data.coordinate,
            description: responseData.data.description,
            domain: responseData.data.domain
          }
          this.weatherData = [
            {
              description: 'Max temperature',
              times: responseData.data.params
                .find((param) => param.description === 'Max temperature')
                .times.map((time) => ({
                  datetime: time.day,
                  value: time.celcius.replace(/\s/g, '').replace('C', ''),
                  unit: '°C'
                }))
            },
            {
              description: 'Min temperature',
              times: responseData.data.params
                .find((param) => param.description === 'Min temperature')
                .times.map((time) => ({
                  datetime: time.day,
                  value: time.celcius.replace(/\s/g, '').replace('C', ''),
                  unit: '°C'
                }))
            },
            {
              description: 'Temperature',
              times: responseData.data.params
                .find((param) => param.description === 'Temperature')
                .times.map((time) => ({
                  datetime: time.datetime,
                  value: time.celcius.replace(/\s/g, '').replace('C', ''),
                  unit: '°C'
                }))
            },
            {
              description: 'Weather',
              times: responseData.data.params
                .find((param) => param.description === 'Weather')
                .times.map((time) => ({
                  datetime: time.datetime,
                  name: time.name
                }))
            }
          ]
        } else {
          this.error = responseData.message || 'Terjadi kesalahan saat mengambil data cuaca.'
        }
      } catch (error) {
        this.error = 'Terjadi kesalahan saat mengambil data cuaca.'
      } finally {
        this.loading = false
      }
    },
    formatDate(dateTime) {
      if (dateTime.length === 8) {
        const year = dateTime.slice(0, 4)
        const month = dateTime.slice(4, 6)
        const day = dateTime.slice(6, 8)
        return `${day}/${month}/${year} `
      } else {
        const year = dateTime.slice(0, 4)
        const month = dateTime.slice(4, 6)
        const day = dateTime.slice(6, 8)
        const hours = dateTime.slice(8, 10)
        const minutes = dateTime.slice(10, 12)
        return `${day}/${month}/${year} ${hours}:${minutes}`
      }
    },
    mergeTemperatureAndWeather() {
      const temperatureData = this.weatherData.find(
        (item) => item.description === 'Temperature'
      ).times
      const weatherData = this.weatherData.find((item) => item.description === 'Weather').times

      const mergedData = []

      temperatureData.forEach((temperatureItem) => {
        const correspondingWeather = weatherData.find(
          (weatherItem) => weatherItem.datetime === temperatureItem.datetime
        )
        if (correspondingWeather) {
          mergedData.push({
            datetime: temperatureItem.datetime,
            temperature: temperatureItem.value,
            weather: correspondingWeather.name
          })
        }
      })

      // Sorting mergedData based on datetime
      mergedData.sort((a, b) => a.datetime.localeCompare(b.datetime))

      return mergedData
    }
  }
}
</script>

<style scoped>
/* Tambahkan CSS sesuai kebutuhan */
</style>
