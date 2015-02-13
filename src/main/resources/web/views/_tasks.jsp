<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>

<div id="addTask" style="display:none">
	<div class="title"><span>Kegiatan</span></div>
	<div class="cb-row">
		<div class="cb-key">Kapan</div>
		<div id="lbWhen" class="cb-value"></div>
	</div>
	<div class="cb-row">
		<div class="cb-key">Siapa</div>
		<div class="cb-value">
			<input id="lbWho" type="text" />
		</div>
	</div>
	<div class="cb-row">
		<div class="cb-key">Apa</div>
		<div class="cb-value">
			<input id="lbWhat" type="text" style="width: 100%; padding: 3px" />
		</div>
	</div>
	<div class="cb-row">
		<div class="cb-key">Dimana</div>
		<div class="cb-value">
			<input id="lbWhere" type="text" style="width: 100%; padding: 3px" />
		</div>
	</div>
	<div class="cb-row">
		<div class="cb-key">Target</div>
		<div class="cb-value">
			<div style="display: table-cell;">
				<input id="lbTarget" type="text" style="width: 50px;" />
			</div>
			<div style="display: table-cell;">
				<select id="lbTargetUnit"></select>
			</div>
			<div id="browseTRUnit" class="overflowmenu" style="height: auto;">
				<div class="icon"></div>
			</div>
		</div>
	</div>
	<div class="cb-action">
		<div id="btnaddTask" class="button">Buat Kegiatan</div>
	</div>
</div>

<div id="editTask" style="display:none">
	<div class="title"><span id="lbWhat"></span></div>
	<div class="cb-row">
		<div class="cb-key">Kapan</div>
		<div id="lbWhen" class="cb-value"></div>
	</div>
	<div class="cb-row">
		<div class="cb-key">Siapa</div>
		<div id="lbWho" class="cb-value"></div>
	</div>
	<div class="cb-row">
		<div class="cb-key">Dimana</div>
		<div id="lbWhere" class="cb-value"></div>
	</div>
	<div class="cb-row">
		<div class="cb-key">Target</div>
		<div class="cb-value">
			<div style="display: table-cell;">
				<input id="lbTarget" type="text" style="width: 50px;" />
			</div>
			<div style="display: table-cell;">
				<select id="lbTargetUnit"></select>
			</div>
			<div id="browseTRUnit" class="overflowmenu" style="height: auto;">
				<div class="icon"></div>
			</div>
		</div>
	</div>
	<div class="cb-row">
		<div class="cb-key">Realisasi</div>
		<div class="cb-value">
			<div style="display: table-cell;">
				<input id="lbRealization" type="text" style="width: 50px;" />
			</div>
			<div style="display: table-cell;">
				<span id="lbRealizationUnit"></span>
			</div>
		</div>
	</div>
	<div class="cb-action">
		<div id="btnSaveTask" class="button">Simpan</div>
		<div class="overflowmenu">
			<div class="icon"></div>
			<div class="menu" position="left">
				<div class="item" id="btnDeleteTask">Hapus</div>
			</div>
		</div>
	</div>
</div>

<div id="listTRUnit" style="display:none">
	<div class="title"><span>Satuan Target dan Realisasi</span></div>
	<div class="cb-row">
		<table class="tablesorter">
			<thead>
				<tr>
					<th>No</th>
					<th>Satuan</th>
				</tr>
			</thead>
			<tbody></tbody>
		</table>
	</div>
	<div class="cb-action">
		<div style="float: left; padding-right: 4px;">
			Satuan
			<input autocomplete="off" type="text" id="name" />
		</div>
		<div style="float: right;">
			<div class="button">Simpan</div>
		</div>
	</div>
</div>