{{- define "app.name" }}
{{- if .Values.nameOverride }}
{{- .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- else -}}
toyou
{{- end -}}
{{- end }}

