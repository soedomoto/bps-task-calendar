<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>

<div id="events" class="list">
	<div class="header">
		<span>Kegiatan</span>
	</div>
	<ul></ul>
	<div class="footer">
		<span>Tambah Kegiatan</span>
	</div>
</div>

<div id="addEvent" style="display:none">
	<div class="title"><span>Kegiatan</span></div>
	<div class="cb-row">
		<div class="cb-key">Judul</div>
		<div class="cb-value">
			<input id="lbTitle" type="text" />
		</div>
	</div>
	<div class="cb-action">
		<div id="btnAddEvent" class="button">Simpan</div>
	</div>
</div>
<div id="editEvent" style="display:none">
	<div class="title">
		<div id="lbCol" class="color"></div>
		<div style="padding: 5px 0 5px 30px;"><span id="lbTitle"></span></div>
	</div>
	<div class="collapsible collapse">
		<div class="content">
			<div class="cb-row">
				<div class="cb-key">Jadwal Kegiatan</div>
				<div class="cb-value">
					<input id="lbEventStart" type="text" /> - <input id="lbEventEnd" type="text" />
					<div id="calContainer"></div>
				</div>
			</div>
			<div class="cb-action">
				<div id="btnUpdateEvent" class="button" style="float: right;">Simpan</div>
			</div>
		</div>
		<div class="button">
			<span class="icon-chevron-down"></span>
		</div>
	</div>
	<div class="cb-action">
		<div style="position: absolute;right: 0px;">
			<div id="btnDelEvent" class="button">Hapus</div>
			<div class="overflowmenu">
				<div class="icon"></div>
				<div class="menu" position="right">
					<a target="_blank" id="lnPrintTL" href="#" style="color: initial;text-decoration: initial;">
						<div class="item">Cetak Surat Tugas</div>
					</a>
					<a target="_blank" id="lnEntrySPJDetail" href="#" style="color: initial;text-decoration: initial;">
						<div class="item">Entri Detail Untuk SPJ</div>
					</a>
					<a target="_blank" id="lnPrintRL" href="#" style="color: initial;text-decoration: initial;">
						<div class="item">Cetak SPJ</div>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>