{{/*
Secret Name for core Database
*/}}
{{- define "app.core.database.secretName" }}
{{- if .Values.core.database.existingSecret }}
{{- .Values.core.database.existingSecret }}
{{- else -}}
{{- printf "%s-core-db-secret" (include "app.name" .) }}
{{- end }}
{{- end }}

{{- define "app.core.gateway.secretName" }}
{{- if .Values.core.gateway.existingSecret }}
{{- .Values.core.gateway.existingSecret }}
{{- else -}}
{{- printf "%s-core-gateway-secret" (include "app.name" .) }}
{{- end }}
{{- end }}

{{/*
Name
*/}}
{{- define "app.core.name" -}}
{{- if .Values.core.nameOverride }}
{{- .Values.core.nameOverride | trunc 63 | trimSuffix "-" }}
{{- else -}}
core
{{- end }}
{{- end }}

{{/*
Fullname
*/}}
{{- define "app.core.fullname" }}
{{- if .Values.core.fullnameOverride }}
{{- .Values.core.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-core" (include "app.name" .) | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "app.core.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "app.core.labels" -}}
{{ include "app.core.selectorLabels" . }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "app.core.selectorLabels" -}}
app.kubernetes.io/name: {{ include "app.core.name" . }}
app.kubernetes.io/instance: {{ include "app.name" . }}
{{- end }}

{{/*
Config map name
*/}}
{{- define "app.core.configMapName" }}
{{- if .Values.core.existingConfigMap }}
{{- .Values.core.existingConfigMap }}
{{- else -}}
{{- printf "%s-core-config" (include "app.name" .) }}
{{- end }}
{{- end }}

{{/*
Service Account Name
*/}}
{{- define "app.core.serviceAccountName" }}
{{- if .Values.core.serviceAccount.create }}
{{- default (include "app.core.fullname" .) .Values.core.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.core.serviceAccount.name }}
{{- end }}
{{- end }}
