<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>

<div id="settings" class="list" style="position:absolute; bottom: 0px; right: 0px; box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 6px;">
	<div class="header">
		<span class="icon-cog"></span> <span>Settings</span>
	</div>
	<div class="ul hide scrollable">
		<div class="cb-row">
			<div class="cb-key">BPS</div>
			<div class="cb-value">
				<input id="lbInstitution" type="text" value="Kabupaten Pesisir Selatan" />
				<span class="notes">Nama Wilayah, seperti : Republik Indonesia, Provinsi Banten</span>
			</div>
		</div>
		<div class="collapsible collapse">
			<div class="content">
				<div class="cb-row">
					<div class="cb-key">Kepala Intansi</div>
					<div class="cb-value">
						<input id="lbChief" type="text" />
					</div>
				</div>
				<div class="cb-row">
					<div class="cb-key">Alamat Intansi</div>
					<div class="cb-value">
						<input id="lbAddress" type="text" value="Jl. Setia Budi Painan" />
					</div>
				</div>
				<div class="cb-row">
					<div class="cb-key">Telepon Intansi</div>
					<div class="cb-value">
						<input id="lbPhone" type="text" value="(0756) 21004" />
					</div>
				</div>
				<div class="cb-row">
					<div class="cb-key">Fax Intansi</div>
					<div class="cb-value">
						<input id="lbFax" type="text" value="(0756) 21004" />
					</div>
				</div>
				<div class="cb-row">
					<div class="cb-key">Website Intansi</div>
					<div class="cb-value">
						<input id="lbWebsite" type="text" value="http://pesselkab.bps.go.id" />
					</div>
				</div>
				<div class="cb-row">
					<div class="cb-key">Email Intansi</div>
					<div class="cb-value">
						<input id="lbEmail" type="text" value="pessel@bps.go.id" />
					</div>
				</div>
				<div class="cb-row">
					<div class="cb-key">Format No. Surat</div>
					<div class="cb-value">
						<input id="lbTlNoFormat" type="text" value="{no}/ST/{year}" />
					</div>
				</div>
				<div class="cb-row">
					<div class="cb-key">Kota Surat Tugas</div>
					<div class="cb-value">
						<input id="lbCapital" type="text" value="Painan" />
					</div>
				</div>
			</div>
			<div class="button">
				<span class="icon-chevron-down"></span>
			</div>
		</div>
		<div class="cb-action" style="padding-left: 5px; padding-right: 5px;">
			<div class="button" id="btnSaveSetting" style="float: left">Simpan Setting</div>
			<div id="status" style="float: right; max-width: 150px; text-align: right; 
				display: none; line-height: 29px; vertical-align: middle;"></div>
		</div>
	</div>
</div>