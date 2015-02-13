<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>

<div id="listRanks" style="display:none">
	<div class="title"><span>Pangkat Golongan</span></div>
	<div class="cb-row">
		<table class="tablesorter">
			<thead>
				<tr>
					<th>Golongan</th>
					<th>Pangkat</th>
				</tr>
			</thead>
			<tbody></tbody>
		</table>
	</div>
	<div class="cb-action">
		<div style="float: left; padding-right: 4px;">
			Golongan
			<input autocomplete="off" style="width: 40px" type="text" id="id" />
		</div>
		<div style="float: left; padding-right: 4px;">
			Pangkat
			<input autocomplete="off" style="width: 100px" type="text" id="name" />
		</div>
		<div style="float: right;">
			<div class="button">Simpan</div>
		</div>
	</div>
</div>