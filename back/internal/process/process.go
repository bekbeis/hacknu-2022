package process

import (
	"encoding/json"
	"strconv"
	"strings"

	"github.com/xuri/excelize/v2"
)

type Data struct {
	Latitude                        float64 `json: "Latitude"`
	Longitude                       float64 `json: "Longitude"`
	Altitude                        float64 `json: "Altitude"`
	Identifier                      string  `json: "Identifier"`
	Timestamp                       float64 `json: "Timestamp"`
	Floor_Label                     string  `json: "Floor"`
	Horizontal_Accuracy             float64 `json: "Horizontal"`
	Vertical_Accuracy               float64 `json: "Vertical"`
	Confidence_In_Location_Accuracy float64 `json: "Accuracy"`
	Activity                        string  `json: "Activity"`
}

var datas [][]Data
var fileName = "hacknu-dev-data.xlsx"

func ExcelToJson(file_name string) ([]byte, error) {
	if file_name == "" {
		file_name = fileName
	}
	file, err := excelize.OpenFile(fileName)
	if err != nil {
		return []byte{}, err
	}
	i := 1

	var datas [][]Data
	for {

		data, err := Assign(file, "dev"+strconv.Itoa(i))

		if err != nil {
			if strings.HasSuffix(err.Error(), "is not exist") {
				if len(data) > 0 {

					datas = append(datas, data)

				}
				break
			}
			return []byte{}, err
		} else {
			datas = append(datas, data)
		}
		i++
	}
	bin, err := json.Marshal(&datas)

	return bin, err
}

func Assign(file *excelize.File, sheet string) ([]Data, error) {
	var data Data

	var datas []Data
	j := 2
	for {

		varr, err := file.GetCellValue(sheet, "A"+strconv.Itoa(j))
		if err != nil || varr == "" {

			return datas, err
		}
		data.Latitude, err = strconv.ParseFloat(varr, 64)

		if err != nil {
			return datas, err
		}
		varr, err = file.GetCellValue(sheet, "B"+strconv.Itoa(j))
		if err != nil || varr == "" {

			return datas, err
		}
		data.Longitude, err = strconv.ParseFloat(varr, 64)

		if err != nil {
			return datas, err
		}
		varr, err = file.GetCellValue(sheet, "C"+strconv.Itoa(j))
		if err != nil || varr == "" {

			return datas, err
		}
		data.Altitude, err = strconv.ParseFloat(varr, 64)

		if err != nil {
			return datas, err
		}
		varr, err = file.GetCellValue(sheet, "D"+strconv.Itoa(j))
		if err != nil || varr == "" {

			return datas, err
		}
		data.Identifier = varr

		varr, err = file.GetCellValue(sheet, "E"+strconv.Itoa(j))
		if err != nil || varr == "" {

			return datas, err
		}
		data.Timestamp, err = strconv.ParseFloat(varr, 64)

		if err != nil {
			return datas, err
		}
		varr, err = file.GetCellValue(sheet, "F"+strconv.Itoa(j))
		if err != nil || varr == "" {

			return datas, err
		}
		data.Floor_Label = varr

		varr, err = file.GetCellValue(sheet, "G"+strconv.Itoa(j))
		if err != nil || varr == "" {

			return datas, err
		}
		data.Horizontal_Accuracy, err = strconv.ParseFloat(varr, 64)

		if err != nil {
			return datas, err
		}
		varr, err = file.GetCellValue(sheet, "H"+strconv.Itoa(j))
		if err != nil || varr == "" {

			return datas, err
		}
		data.Vertical_Accuracy, err = strconv.ParseFloat(varr, 64)

		if err != nil {
			return datas, err
		}
		varr, err = file.GetCellValue(sheet, "I"+strconv.Itoa(j))
		if err != nil || varr == "" {

			return datas, err
		}
		data.Confidence_In_Location_Accuracy, err = strconv.ParseFloat(varr, 64)

		if err != nil {
			return datas, err
		}
		varr, err = file.GetCellValue(sheet, "J"+strconv.Itoa(j))
		if err != nil || varr == "" {

			return datas, err
		}
		data.Activity = varr

		datas = append(datas, data)

		j++
	}

}

func EX_JS_Instance(file_name string, i int) ([]byte, error) {
	if file_name == "" {
		file_name = fileName
	}

	file, err := excelize.OpenFile(fileName)
	if err != nil {
		return []byte{}, err
	}
	data, err := Assign(file, "dev"+strconv.Itoa(i))

	if err != nil {
		return []byte{}, err
	}

	bin, err := json.Marshal(&data)

	return bin, nil
}
