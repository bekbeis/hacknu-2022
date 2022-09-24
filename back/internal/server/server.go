package server

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/whym9/hacknu/internal/process"
)

var (
	name = "HTTP_receiver_processed_errors_total"
	help = "The total number of receiver errors"
	key  = "errors"
)

func StartServer(addr string) {

	http.HandleFunc("/", Receive)
	http.HandleFunc("/get_all", GetAll)
	http.HandleFunc("/get", GetOne)
	fmt.Println("HTTP server has started")
	err := http.ListenAndServe(addr, nil)

	if err != nil {
		fmt.Println(err.Error())
	}

}

func GetAll(w http.ResponseWriter, r *http.Request) {
	if bin, err := process.ExcelToJson(""); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("SERVER_ERROR"))
	} else {
		w.WriteHeader(http.StatusOK)
		w.Write(bin)
	}
}

func GetOne(w http.ResponseWriter, r *http.Request) {
	ind := r.URL.Query().Get("ind")
	i, _ := strconv.Atoi(ind)
	if bin, err := process.EX_JS_Instance("", i); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("SERVER_ERROR"))
	} else {
		w.WriteHeader(http.StatusOK)
		w.Write(bin)
	}
}

func Receive(w http.ResponseWriter, r *http.Request) {

	if r.Method == "GET" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Wrong request method"))

		return
	}

	if err := r.ParseMultipartForm(300 * 1024 * 1024); err != nil {

		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("CANT_PARSE_FORM"))

		return
	}

	file, fileheader, err := r.FormFile("uploadFile")
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("INVALID_FILE"))

		return
	}
	defer file.Close()

	data, err := process.ExcelToJson(fileheader.Filename)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("CANT_PROCESS_DATA"))
	}
	w.WriteHeader(http.StatusOK)
	w.Write(data)

	return
}
