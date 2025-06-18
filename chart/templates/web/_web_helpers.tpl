{{/*
Name
*/}}
{{- define "app.web.name" -}}
{{- if .Values.web.nameOverride }}
{{- .Values.web.nameOverride | trunc 63 | trimSuffix "-" }}
{{- else -}}
web
{{- end }}
{{- end }}

{{/*
Fullname
*/}}
{{- define "app.web.fullname" }}
{{- if .Values.web.fullnameOverride }}
{{- .Values.web.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-web" (include "app.name" .) | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "app.web.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "app.web.labels" -}}
{{ include "app.web.selectorLabels" . }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "app.web.selectorLabels" -}}
app.kubernetes.io/name: {{ include "app.web.name" . }}
app.kubernetes.io/instance: {{ include "app.name" . }}
{{- end }}

{{/*
Config map name
*/}}
{{- define "app.web.configMapName" }}
{{- if .Values.web.existingConfigMap }}
{{- .Values.web.existingConfigMap }}
{{- else -}}
{{- printf "%s-web-config" (include "app.name" .) }}
{{- end }}
{{- end }}

{{/*
Service Account Name
*/}}
{{- define "app.web.serviceAccountName" }}
{{- if .Values.web.serviceAccount.create }}
{{- default (include "app.web.fullname" .) .Values.web.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.web.serviceAccount.name }}
{{- end }}
{{- end }}
